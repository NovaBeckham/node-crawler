import { getData } from './puppeteer';

getData();
setInterval(() => {
  getData();
}, 1000 * 20);
