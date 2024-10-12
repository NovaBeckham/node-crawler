/*
 * @Description:
 * @Author: hyx
 * @Date: 2024-10-12 17:48:32
 */

import { launch } from 'puppeteer';

export const getData = async () => {
  // 启动浏览器
  const browser = await launch({ headless: false });
  const page = await browser.newPage();

  // 导航到登录页面
  await page.goto('http://test2.taptapshop.com/login');

  await page.type('#userName_input', 'heyuxin@x6voyager.com');
  await page.type('#password_input', 'heyuxinadmin');

  // 点击登录按钮
  await page.click('.arco-btn-primary');

  // 等待导航完成
  await page.waitForNavigation();

  // 打印页面标题
  await page.goto('http://test2.taptapshop.com/supplyChain/goodsPickups');

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const elements = await page.$$('.arco-tag-content');

  console.log('elements', elements);

  const items = await Promise.all(
    elements.map(async (element) => {
      return await element.getProperty('textContent');
    }),
  );

  // 关闭浏览器
  await browser.close();
};
