/*
 * @Description:
 * @Author: hyx
 * @Date: 2024-12-05 17:01:13
 */

import { ElementHandle, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
const fs = require('fs');
const path = require('path');
import axios from 'axios';

interface SrcList {
  [key: string]: string;
}

const downloadVideo = async (url: string, outputPath: string) => {
  const writer = fs.createWriteStream(outputPath);

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};

export async function getData(
  filteredEpisodes: ElementHandle<Element>[],
  page: Page,
  videoName: string,
  pageNumber: number,
) {
  let video = null;
  let dir = null;
  for (let j = 0; j < filteredEpisodes.length; j++) {
    try {
      if (j === 0) {
        const videoStart = await page.$('.pcEpisode_videoStart__IcAdF');
        await page.evaluate((info: any) => info.click(), videoStart);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        video = await page.$('#video_pc_id');
        const src = await video.evaluate(
          (info) => info.getAttribute('src'),
          video,
        );
        dir = path.join(
          __dirname,
          `第 ${pageNumber} 页`,
          videoName.replace(/[:!?]/g, '').replace(/\t/g, ''),
        );
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const filePath = path.join(dir, `1.mp4`);
        await page.evaluate((info) => info.pause(), video);
        await downloadVideo(src, filePath);
        console.log(`下载完成: ${filePath}`);
      } else {
        const episodeItemEl = filteredEpisodes[j];
        console.log('000');
        await episodeItemEl.evaluate(
          (info: any) => info.click(),
          episodeItemEl,
        );
        console.log('111');
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // 获取video元素
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const src = await video.evaluate(
          (info: any) => info.getAttribute('src'),
          video,
        );
        const filePath = path.join(dir, `${j + 1}.mp4`);
        await page.evaluate((info) => info.pause(), video);
        await downloadVideo(src, filePath);
        console.log(`下载完成: ${filePath}`);
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

const getOnePageItem = async (page: Page, pageNumber: number) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.waitForSelector('.FirstList_itemBox__AfNNm');
  const itemBoxes = await page.$$('.FirstList_itemBox__AfNNm');
  if (itemBoxes.length === 0) {
    return false;
  }
  for (let i = 0; i < itemBoxes.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // 获取当前页的全部剧集
    const parentElement = await page.$('.FirstList_firstListBox__eN_W1');
    const hrefs = await page.evaluate((parent) => {
      const items = Array.from(
        parent.getElementsByClassName('FirstList_itemBox__AfNNm'),
      );
      return items.map((item) => {
        const bookNameElement: any = item.getElementsByClassName(
          'FirstList_bookName__cULmf',
        )[0];
        return bookNameElement.href; // 获取 href 属性
      }); // 过滤掉 null 值
    }, parentElement);

    await page.goto(hrefs[i]);
    console.log('newPageUrl-goto');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const videoNameEl = await page.$('.film_bookName__ys_T3');
    const videoName = await videoNameEl.evaluate((el) => el.textContent);
    console.log('videoName', videoName);
    const playNowEl = await page.$('.film_playBtn__yM_Mp');
    console.log('videoName111', videoName);
    const newItemUrl = await playNowEl.evaluate((info) => {
      const baseUrl = window.location.origin;
      const href = info.getAttribute('href');
      return new URL(href, baseUrl).href;
    });
    await page.goto(newItemUrl);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log('videoName222', videoName);
    const episodeListEl = await page.$$(
      '.RightList_linkText__86R_r:not(.RightList_linkTextLock__zb1G6)',
      { isolate: false },
    );
    console.log('videoName333', videoName);
    await getData(episodeListEl, page, videoName, pageNumber);
    await page.goBack();
    console.log('goBack1111');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.goBack();
    console.log('goBack2222');
    // await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  return true;
};

export const getGenres = async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=1380,800', // 设置窗口大小
      '--window-position=200,100', // 设置窗口位置
    ],
  });
  const page = await browser.newPage();

  page.setViewport({ width: 1500, height: 800 });

  await page.goto('https://www.dramaboxdb.com/genres'); // 替换为你的目标网址

  await page.waitForSelector('.paginationCom_normalLi__YFrvZ');

  const links = await page.$$('.paginationCom_normalLi__YFrvZ');

  let maxLength = 0;

  if (links && links.length > 0) {
    const lastLink = links[links.length - 1];
    const textContent = await lastLink.evaluate((el) => el.textContent);
    maxLength = Number(textContent);
  }

  for (let i = 92; i <= maxLength; i++) {
    await page.goto(`https://www.dramaboxdb.com/genres/0/${i}`);
    await getOnePageItem(page, i);
  }
  console.log('JSON file has been created: allVideoList.json');
};
