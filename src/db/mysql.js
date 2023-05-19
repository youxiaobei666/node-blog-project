const mysql = require("mysql2");
const { MYSQL_CONF } = require("../conf/db"); // 导入配置

const connection = mysql.createConnection(MYSQL_CONF); // 创建示例

connection.connect(); // 开始连接， 保持数据库连接状态

// let query = "select * from users where username = 'lisi'";

// 统一执行 sql 的函数
const sqlFun = (sql) => {
  const promise = new Promise((resolve, reject) => {
    connection.query(sql, (err, result) => {
      if (err) {
        reject(err.message);
        return;
      }
      resolve(result);
    });
  });

  return promise;
};

module.exports = { sqlFun, escape: mysql.escape };
