const fs = require("fs");
const path = require("path");
const readline = require("readline");

// 文件路径
const filePath = path.join(__dirname, "../", "../", "logs", "access.log");
// 创建 readStream
const readStream = fs.createReadStream(filePath);

// 创建 readline 对象
const rl = readline.createInterface({
  input: readStream,
});

// 记录谷歌浏览器访问的总数
let chromeNum = 0;
let sum = 0;

// 逐行读取
rl.on("line", (lineData) => {
  if (!lineData) {
    return;
  }
  // 记录总行数
  sum++;

  const arr = lineData.split(" -- ");

  if (arr[2] && arr[2].indexOf("Chrome") > 0) {
    chromeNum++;
  }
});

// 读取结束
rl.on("close", () => {
  console.log("chrome 占比：", chromeNum / sum);
});
