/*
 * @Description:
 * @Author: hyx
 * @Date: 2024-12-05 17:01:13
 */

import { ElementHandle, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
const fs = require('fs');

interface SrcList {
  [key: string]: string;
}

export async function getData(
  filteredEpisodes: ElementHandle<Element>[],
  page: Page,
) {
  const list: Array<SrcList> = [];
  let video = null;
  for (let j = 0; j < filteredEpisodes.length; j++) {
    try {
      if (j === 0) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const videoStart = await page.$('.pcEpisode_videoStart__IcAdF');
        await videoStart.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await page.waitForSelector('#video_pc_id');
        video = await page.$('#video_pc_id');
        const src = await video.evaluate((info) => info.getAttribute('src'));
        list.push({ '1': src });
      } else {
        const episodeItemEl = filteredEpisodes[j];
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('000', episodeItemEl)
        await episodeItemEl.click();
        console.log('111', episodeItemEl)
        // await new Promise((resolve) => setTimeout(resolve, 2000));
        // 获取video元素
        await new Promise((resolve) => setTimeout(resolve, 800));
        const src = await video.evaluate((info: any) =>
          info.getAttribute('src'),
        );
        console.log('2222', src)
        list.push({ [`${j + 1}`]: src });
      }
    } catch (error) {
      console.log('error', error);
    }
  }
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return list;
}

const getOnePageItem = async (page: Page) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.waitForSelector('.FirstList_itemBox__AfNNm');
  const itemBoxes = await page.$$('.FirstList_itemBox__AfNNm');
  if (itemBoxes.length === 0) {
    return false;
  }
  const videoList: Array<{ [key: string]: Array<SrcList> }> = [];
  for (let i = 0; i < itemBoxes.length; i++) {
    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // 获取当前页的全部剧集
    await page.waitForSelector('.FirstList_itemBox__AfNNm');
    const boxList = await page.$$('.FirstList_itemBox__AfNNm');
    const itemBox = boxList[i];
    const bookNameElement = await itemBox.$('.FirstList_bookName__cULmf');
    // 获取当前剧集的URL
    const newPageUrl = await bookNameElement.evaluate((info) => {
      const baseUrl = window.location.origin;
      const href = info.getAttribute('href');
      return new URL(href, baseUrl).href;
    });

    await page.goto(newPageUrl);
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.waitForSelector('.film_bookName__ys_T3');
    const videoNameEl = await page.$('.film_bookName__ys_T3');
    const videoName = await videoNameEl.evaluate((el) => el.textContent);
    console.log('videoName', videoName);
    await page.waitForSelector('.film_playBtn__yM_Mp');
    const playNowEl = await page.$('.film_playBtn__yM_Mp');
    await playNowEl.click();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.waitForSelector('.RightList_linkText__86R_r');
    const episodeListEl = await page.$$(
      '.RightList_linkText__86R_r:not(.RightList_linkTextLock__zb1G6)',
    );
    const list = await getData(episodeListEl, page);
    console.log('list', list);
    videoList.push({ [`${videoName}`]: list });
    await page.goBack();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.goBack();
    // await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  console.log('videoList', videoList);
  return videoList;
};

export const getGenres = async () => {
  // 启动浏览器
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto('https://www.dramaboxdb.com/genres'); // 替换为你的目标网址

  await page.waitForSelector('.paginationCom_normalLi__YFrvZ');

  const links = await page.$$('.paginationCom_normalLi__YFrvZ');

  let maxLength = 0;

  if (links && links.length > 0) {
    const lastLink = links[links.length - 1];
    const textContent = await lastLink.evaluate((el) => el.textContent);
    maxLength = Number(textContent);
  }

  for (let i = 29; i <= maxLength; i++) {
    await page.goto(`https://www.dramaboxdb.com/genres/0/${i}`);
    const onPageList = await getOnePageItem(page);
    if (onPageList) {
      await fs.writeFileSync(
        `第 ${i} 页.json`,
        JSON.stringify(onPageList, null, 2),
      );
    }
  }
  console.log('JSON file has been created: allVideoList.json');
};
