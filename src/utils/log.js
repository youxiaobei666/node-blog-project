const fs = require("fs");
const path = require("path");

/**
 * 写日志的一小步操作
 * @param {Function} writeStream
 * @param {string} log
 */
const writeLog = function (writeStream, log) {
  writeStream.write(log + "\n");
};

/**
 * 写入流函数
 * @param {string} fileName -logs 文件夹下的文件名，你将要写入的文件
 * @return writeStream
 */
const createWriteStream = function (fileName) {
  const fullFilePath = path.join(__dirname, "../", "../", "logs", fileName);
  const writeStream = fs.createWriteStream(fullFilePath, { flags: "a" });
  return writeStream;
};

// 1. 写入访问日志
// 利用 createWriteStream 函数创建 access 写入流
const accessWriteStream = createWriteStream("access.log");
const access = function (log) {
  writeLog(accessWriteStream, log);
};

// 2. 写入错误日志
const errorWriteStream = createWriteStream("error.log");
const error = function (log) {
  writeLog(errorWriteStream, log);
};

// 3. 写入事件日志
const eventWriteStream = createWriteStream("event.log");
const event = function (log) {
  writeLog(errorWriteStream, log);
};

module.exports = {
  access,
  error,
  event,
};
