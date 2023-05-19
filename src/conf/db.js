const env = process.env.NODE_ENV; // 环境参数

// 配置
let MYSQL_CONF = "";
let REDIS_CONF = "";

if (env === "dev") {
  // mysql
  MYSQL_CONF = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yjc010203.",
    database: "myblog",
  };
  //redis
  REDIS_CONF = {
    host: "127.0.0.1",
    port: 6379,
  };
}

if (env === "production") {
  // 暂时使用一样的
  MYSQL_CONF = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yjc010203.",
    database: "myblog",
  };
  //redis
  REDIS_CONF = {
    host: "127.0.0.1",
    port: 6379,
  };
}

// 导出数据库连接配置
module.exports = {
  MYSQL_CONF,
  REDIS_CONF,
};
