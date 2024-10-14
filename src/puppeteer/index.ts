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

  const cookie = await page.cookies('http://test2.taptapshop.com/supplyChain/goodsPickups')

  
  const cookieArr = cookie.map((val) => {
    return `${val.name}=${val.value}`
  })

  console.log('cookieArr', cookieArr.join(';'))

  // const elements = await page.$$('.arco-table-body');

  // const items = await Promise.all(
  //   elements.map(async (element) => {
  //     console.log('element', element.$$('.tbody > .arco-table-tr'))
  //     return await element.getProperty('textContent');
  //   }),
  // );

  // console.log('toString', items[0].toString())
  // console.log('asElement', items[0].asElement())
  // console.log('jsonValue', items[0].jsonValue())
  // console.log('move', items[0].move())
  // console.log('remoteObject', items[0].remoteObject())

  // 关闭浏览器
  await browser.close();
};
