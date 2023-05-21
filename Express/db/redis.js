/**
 * 以下代码主要是用于与 Redis 数据库进行交互的模块。具体作用如下：

1. 创建 Redis 客户端实例并进行配置：
   - 从 "../conf/db" 导入 Redis 的配置信息。
   - 使用配置信息创建 Redis 客户端实例。

2. 监听错误事件：
   - 当 Redis 客户端发生错误时，将错误信息打印到控制台。

3. 设置 Redis 中的键值对：
   - `set(key, value)` 函数用于向 Redis 中设置键值对。
   - 参数 `key` 是要设置的键。
   - 参数 `value` 是要设置的值。
   - 如果值为对象类型，则将其转换为字符串。
   - 使用 Redis 客户端的 `set` 方法将键值对存储到 Redis 中。

4. 获取 Redis 中指定键的值：
   - `get(key)` 函数用于从 Redis 中获取指定键的值。
   - 参数 `key` 是要获取值的键。
   - 返回一个 Promise 对象，该对象在获取成功时会传递键对应的值，如果键不存在则传递 `null`。
   - 使用 Redis 客户端的 `get` 方法获取键对应的值。
   - 如果值为空，解析为 `null`。
   - 如果值为 JSON 字符串，则尝试解析为 JSON 格式返回。
   - 如果解析失败，则直接返回原始值。

模块通过以上功能提供了简单的接口来设置和获取 Redis 中的键值对。
 */

const { REDIS_CONF } = require("../conf/db");
const redis = require("redis");
// console.log(REDIS_CONF);
// 创建 Redis 客户端实例并进行配置
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);

// 监听错误事件
redisClient.on("error", (err) => {
  console.error(err);
});

module.exports = {
  redisClient,
};
