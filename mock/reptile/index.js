const puppeteer = require('puppeteer');

const pathToExtension = require('path').join(__dirname, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium');

async function run(){
  console.log('开始')
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: pathToExtension,
    timeout: 30000, // 默认超时为30秒，设置为0则表示不设置超时
  });

  // 打开空白页面
  const page = await browser.newPage();

  await page.goto('http://localhost:8080/', {
      // 配置项
      // waitUntil: 'networkidle', // 等待网络状态为空闲的时候才继续执行
  });
  
  const dimensions = await page.evaluate(() => {
    console.log($('listtyle1_list .listtyle1 img').attr('src'))
    return $('listtyle1_list .listtyle1 img').eq(0).attr('src')
  });
  
  console.log(dimensions);

  await browser.close();
}

run();