const crypto = require("crypto");

// 定义密钥
const SECRET_KEY = "YOUxiaobei_123";

// md5 加密
/**
 *
 * @param {string} content - 加密的内容
 */
function md5(content) {
  let md5 = crypto.createHash("md5");
  return md5.update(content).digest("hex");
}

/**
 *
 * @param {string} password - 用户的密码
 * @returns
 */
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

// 测试,注意数据库密码长度需要更改为 加密后的字符串长度
// console.log(genPassword("123")); //c83cdaeb658227288a322ec566bf3cad

module.exports = {
  genPassword,
};
