const { sqlFun, escape } = require("../db/mysql");
const { genPassword } = require("../utils/cryp");

const login = (username, password) => {
  // 预防 sql 注入
  username = escape(username);

  // 加密密码
  password = genPassword(password);
  // 预防 sql 注入
  password = escape(password);
  const sql = `
        select username,realname from users where username=${username} and password=${password}
    `;
  return sqlFun(sql).then((rows) => {
    // 没有查询到就是空对象
    return rows[0] || {};
  });
};

module.exports = {
  login,
};
