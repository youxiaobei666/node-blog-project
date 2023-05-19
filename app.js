const querystring = require("querystring");
const handleBlogRouter = require("./src/router/blog");
const handleUserRouter = require("./src/router/user");
const { set, get } = require("./src/db/redis");
const { access } = require("./src/utils/log");

/**
 * 获取cookie的过期时间
 */
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

  return d.toGMTString();
};

// session 数据
const SESSION_DATA = {};

/**
 * 处理 post data
 * @param {object} req - 请求对象
 * @returns {Promise} 返回一个 Promise 对象
 */
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    // 如果请求方法不是 post，直接返回一个空对象
    if (req.method !== "POST") {
      console.log("请求方法不是 post");
      resolve({});
      return;
    }
    // 如果请求头的格式不是 json，直接返回一个空对象
    if (req.headers["content-type"] !== "application/json") {
      console.log("请求头的格式不是 json");
      resolve({});
      return;
    }
    let postData = "";
    req.on("data", (chunk) => {
      // 将 json 格式的数据转换为字符串并保存为 postData
      postData += chunk.toString();
    });

    req.on("end", () => {
      // 如果 postData 为空，直接返回一个空对象
      if (!postData) {
        resolve({});
        return;
      }
      // 将 postData 解析为 JavaScript 对象并返回
      resolve(JSON.parse(postData));
    });
  });
  return promise;
};

/**
 * 处理来自客户端的 HTTP 请求并将它们路由到相应的处理函数。
 *
 * @param {Object} req - HTTP 请求对象。
 * @param {Object} res - HTTP 响应对象。
 */
const serverHandle = (req, res) => {
  // 设置返回格式
  res.setHeader("content-type", "application/json");
  // 获取常用参数
  const method = req.method;
  const url = req.url;
  req.path = url.split("?")[0];
  // 记录访问日志(方法，url,客户端，时间)
  access(
    `${req.method} -- ${req.url} -- ${
      req.headers["user-agent"]
    } -- ${Date.now()}`
  );

  // 解析 query
  req.query = querystring.parse(url.split("?")[1]);

  req.cookie = {}; // 初始化 cookie 对象

  const cookieStr = req.headers.cookie || ""; // 获取客户端发送的 cookie 字符串，如果不存在则设置为空字符串

  if (cookieStr) {
    // 如果客户端发送了 cookie
    cookieStr.split(";").forEach((item) => {
      // 分割 cookie 字符串，并对每个 cookie 进行处理
      const arr = item.split("="); // 分割出 cookie 的键和值
      if (arr.length === 2) {
        // 如果 cookie 的键和值都存在
        const key = arr[0].trim(); // 去除键两侧的空格
        const value = arr[1].trim(); // 去除值两侧的空格
        req.cookie[key] = value; // 将键值对存储到 cookie 对象中
      }
    });
  }

  console.log("请起头的cookie:", req.cookie);

  // 使用 redis 解析 session
  let needSetCookie = false;
  let userId = req.cookie.userId;
  if (!userId) {
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    // 初始化 redis 中 session 值
    set(userId, {});
  }
  // 获取 session

  req.sessionId = userId;

  get(req.sessionId)
    .then((sessionData) => {
      // 如果取出的 session 为空
      if (sessionData === null) {
        // 初始化 redis 中 session 值
        set(req.sessionId, {});
        // 设置 session
        req.session = {};
      } else {
        // 设置 session
        req.session = sessionData;
      }

      // 处理 post data
      return getPostData(req);
    })
    .then((postData) => {
      // 将数据放入body
      req.body = postData;

      /**
       *  blog 路由
       */
      const blogResult = handleBlogRouter(req, res);

      // promise 有结果
      if (blogResult) {
        blogResult.then((blogData) => {
          if (needSetCookie) {
            res.setHeader("Set-Cookie", `userId=${userId}`);
          }
          res.end(JSON.stringify(blogData));
        });
        return;
      }

      /**
       *  user 路由
       */

      const userResult = handleUserRouter(req, res);
      if (userResult) {
        if (needSetCookie) {
          res.setHeader("Set-Cookie", `userId=${userId}`);
        }
        userResult.then((userData) => {
          res.end(JSON.stringify(userData));
        });
        return;
      }

      /**
       * 处理 404
       */
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404,oops");
      res.end();
    });
};

module.exports = serverHandle;
