/*
 * @Description:
 * @Author: hyx
 * @Date: 2024-10-12 17:48:32
 */

import { Page } from 'puppeteer';

export interface SrcList {
  [key: string]: string
}

export const getData = async (page: Page) => {
  const nodes = await page.$$(
    '.RightList_linkText__86R_r:not(.RightList_linkTextLock__zb1G6)',
  );

  const srcList: Array<SrcList> = [];

  // 循环 title 集合，对于每个 title，找到对应的节点并点击
  for (const node of nodes) {
    const episode = await node.evaluate((el) => el.textContent);
    await node.click();
    // 等待页面加载或特定元素出现
    await page.waitForSelector('#video_pc_id');
    // 获取所有具有类名 .video_pc_id 的 <video> 标签的 src 属性
    const video = await page.$('#video_pc_id');
    const src = await video.getProperty('src');
    const videoSrc = (await src.jsonValue()) as string;
    console.log('Video src:', videoSrc);
    srcList.push({ [`EP${episode}`]: videoSrc });
    // 等待一段时间或特定的加载指示，以确保视频 src 属性已更新
    await new Promise((resolve) => setTimeout(resolve, 3000)); // 等待1秒，根据实际情况调整
  }
  console.log('srcList', srcList)
  return srcList;
};
