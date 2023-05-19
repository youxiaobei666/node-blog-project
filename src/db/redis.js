const { REDIS_CONF } = require("../conf/db");
const redis = require("redis");

// 配置 redis
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

// redis.on
redisClient.on("error", (err) => {
  console.error(err);
});

// set 方法
function set(key, value) {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  }
  redisClient.set(key, value, redis.print);
}

// get 方法
function get(key) {
  // 使用 promise
  return new Promise((resolve, reject) => {
    //  使用 redisClient.get
    redisClient.get(key, (err, value) => {
      if (err) {
        reject(err);
        return;
      }
      if (value === null) {
        resolve(null);
        return;
      }

      
      try {
        resolve(JSON.parse(value));
      } catch (ex) {
        resolve(value);
      }
    });
  });
}

module.exports = {
  set,
  get,
};
