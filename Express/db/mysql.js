/**
 * 代码的作用是创建一个与 MySQL 数据库的连接实例，并提供了一个函数 `sqlFun`，用于执行 SQL 查询语句并返回一个 Promise 对象，包含查询结果或错误信息。该函数接受一个 SQL 查询语句作为参数，并使用连接实例的 `query` 方法执行查询。如果查询发生错误，将错误信息传递给 Promise 的 `reject` 方法；如果查询成功，将查询结果传递给 Promise 的 `resolve` 方法。

此外，还导出了一个名为 `escape` 的方法，该方法来自 `mysql2` 库，用于转义 SQL 查询中的参数，以防止 SQL 注入攻击。

整体而言，以上代码封装了与 MySQL 数据库的连接和查询操作，提供了一个简化的接口，使得在其他模块中可以方便地执行 SQL 查询并处理结果或错误信息。
 */

const mysql = require("mysql2");
const { MYSQL_CONF } = require("../conf/db"); // 导入配置

// 创建与 MySQL 数据库的连接实例
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "yjc010203.",
  database: "myblog",
});

// 建立数据库连接
connection.connect();

/**
 * 统一执行 SQL 查询的函数
 * @param {string} sql - 要执行的 SQL 查询语句
 * @returns {Promise} - 返回一个 Promise 对象，包含查询结果或错误信息
 */
const sqlFun = (sql) => {
  const promise = new Promise((resolve, reject) => {
    // 执行 SQL 查询
    connection.query(sql, (err, result) => {
      if (err) {
        // 如果发生错误，将错误信息传递给 reject
        reject(err.message);
        return;
      }
      // 查询成功，将查询结果传递给 resolve
      resolve(result);
    });
  });

  return promise;
};

// 导出模块的方法和函数
module.exports = {
  sqlFun, // 统一执行 SQL 查询的函数
  escape: mysql.escape, // 用于转义 SQL 查询中的参数
};
