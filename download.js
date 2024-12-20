const fs = require('fs-extra');
const axios = require('axios');
const path = require('path');

// 创建axios实例
const service = axios.create({
  baseURL: '', // api 的 base_url
  // 永不凋谢，真男人 就是这么持久 😄😄
  timeout: 90000000, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 从指定文件夹读取所有 JSON 文件
const jsonFolderPath = path.join(__dirname, '../crawler-list'); // 替换为你的 JSON 文件夹路径

async function downloadVideo(url, filename) {
  const response = await service.get(url, {
    responseType: 'stream',
  });

  const writer = fs.createWriteStream(filename);
  await response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function processJsonFile(filePath) {
  const data = await fs.readJson(filePath);
  const folderName = path.basename(filePath, '.json');

  const mainDir = path.join(__dirname, folderName);
  await fs.ensureDir(mainDir); // 创建以 JSON 文件名命名的文件夹

  for (const series of data) {
    for (const [seriesName, episodes] of Object.entries(series)) {
      const seriesDir = path.join(mainDir, seriesName);
      await fs.ensureDir(seriesDir); // 创建以剧集名称命名的子文件夹

      for (const episode of episodes) {
        const [episodeName, url] = Object.entries(episode)[0];
        const filename = path.join(seriesDir, `${episodeName}.mp4`);

        console.log(`Downloading ${url} to ${filename}`);
        const data = await downloadVideo(url, filename);
      }
    }
  }
}

async function main() {
  const files = await fs.readdir(jsonFolderPath);

  for (const file of files) {
    if (path.extname(file) === '.json') {
      const filePath = path.join(jsonFolderPath, file);
      await processJsonFile(filePath);
    }
  }

  console.log('All downloads completed.');
}

main().catch(console.error);
