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

export const getData = async (
  filteredEpisodes: ElementHandle<Element>[],
  page: Page,
) => {
  const list: Array<SrcList> = [];
  for (let j = 0; j < filteredEpisodes.length; j++) {
    // 获取集数
    await page.waitForSelector('.pcSeries_listItem__sd0Xp');
    const episodeList = await page.$$('.pcSeries_listItem__sd0Xp');
    const episodeItemEl = episodeList[j];
    // 获取当前是第几集
    const rightIntroEl = await episodeItemEl.$('.pcSeries_rightIntro__UFC_8');
    if (rightIntroEl) {
      // 获取当前集数的链接
      const newPageUrl = await rightIntroEl.evaluate((info) => {
        const baseUrl = window.location.origin;
        const href = info.getAttribute('href');
        return new URL(href, baseUrl).href;
      });
      const pageNumEl = await rightIntroEl.$('.pcSeries_pageNum__xkXBk');
      // 获取当前是第几集
      const pageNum = await pageNumEl.evaluate((el) => el.textContent);
      await page.goto(newPageUrl);
      // 获取视频容器
      await page.waitForSelector('.pcEpisode_leftVideo__qV0HP');
      const videoStartEl = await page.$('.pcEpisode_leftVideo__qV0HP');
      await videoStartEl.click();
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // 获取video元素
      await page.waitForSelector('#video_pc_id');
      const video = await page.$('#video_pc_id');
      const src = await video.evaluate((info) => info.getAttribute('src'));
      list.push({ [pageNum]: src });
      await page.goBack();
    }
  }
  return list;
};

const getOnePageItem = async (page: Page) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await page.waitForSelector('.FirstList_itemBox__AfNNm');
  const itemBoxes = await page.$$('.FirstList_itemBox__AfNNm');
  if (itemBoxes.length === 0) {
    console.log('00000');
    return false;
  }
  console.log('1111');
  const videoList: Array<{ [key: string]: Array<SrcList> }> = [];
  for (let i = 0; i < itemBoxes.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await page.waitForSelector('.film_bookName__ys_T3');
    const videoNameEl = await page.$('.film_bookName__ys_T3');
    // 获取剧名
    const videoName = await videoNameEl.evaluate((el) => el.textContent);
    console.log('videoName', videoName);
    await page.waitForSelector('.pcSeries_listItem__sd0Xp');
    const episodeListEl = await page.$$('.pcSeries_listItem__sd0Xp');
    console.log('episodeListEl');
    const filteredEpisodes = await Promise.all(
      episodeListEl.map(async (el) => {
        // 检查每个 pcSeries_listItem__sd0Xp 元素是否包含 pcSeries_imageMark__ltmj0 子节点
        const hasImageMark = await el.$('.pcSeries_imageMark__ltmj0');
        return hasImageMark ? null : el; // 如果包含 pcSeries_imageMark__ltmj0 返回 null，否则返回元素
      }),
    ).then((results) => results.filter(Boolean));
    console.log('filteredEpisodes');
    const list = await getData(filteredEpisodes, page);
    console.log('list', list);
    videoList.push({ [`${videoName}`]: list });
    await page.goBack();
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

  await page.goto(
    'https://www.dramaboxdb.com/movie/41000107585/the-second-chance-mother',
  ); // 替换为你的目标网址

  await page.waitForNavigation();
  await page.waitForSelector('.film_bookName__ys_T3');
  const videoNameEl = await page.$('.film_bookName__ys_T3');
  // 获取剧名
  const videoName = await videoNameEl.evaluate((el) => el.textContent);
  console.log('videoName', videoName);
  await page.waitForSelector('.pcSeries_listItem__sd0Xp');
  const episodeListEl = await page.$$('.pcSeries_listItem__sd0Xp');
  console.log('episodeListEl');
  const filteredEpisodes = await Promise.all(
    episodeListEl.map(async (el) => {
      // 检查每个 pcSeries_listItem__sd0Xp 元素是否包含 pcSeries_imageMark__ltmj0 子节点
      const hasImageMark = await el.$('.pcSeries_imageMark__ltmj0');
      return hasImageMark ? null : el; // 如果包含 pcSeries_imageMark__ltmj0 返回 null，否则返回元素
    }),
  ).then((results) => results.filter(Boolean));
  console.log('filteredEpisodes');
  const list = await getData(filteredEpisodes, page);
  console.log('list', list);
  await fs.writeFileSync(
    `第 12 页.json`,
    JSON.stringify({ 'the-second-chance-mother': list }, null, 2),
  );
  // videoList.push({ [`${videoName}`]: list });

  // for (let i = 12; i <= maxLength; i++) {
  //   await page.goto(`https://www.dramaboxdb.com/genres/0/${i}`);
  //   const onPageList = await getOnePageItem(page);
  //   if (onPageList) {
  //     await fs.writeFileSync(
  //       `第 ${i} 页.json`,
  //       JSON.stringify(onPageList, null, 2),
  //     );
  //   }
  // }
  console.log('JSON file has been created: allVideoList.json');
};
