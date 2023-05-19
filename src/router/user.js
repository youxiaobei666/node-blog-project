const { login } = require("../controller/user");
const { set } = require("../db/redis");

const { SuccessModel, ErrorModel } = require("../model/resModel");

/**
 * 获取cookie的过期时间
 */
const getCookieExpires = () => {
  const d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);

  return d.toGMTString();
};

/**
 * 处理用户相关路由的函数。
 *
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @return {Promise} 成功或失败的模型对象
 */
const handleUserRouter = (req, res) => {
  const method = req.method;

  // 处理用户登录请求
  if (method === "POST" && req.path === "/api/user/login") {
    // 从请求体中获取用户名和密码
    const { username, password } = req.body;

    // const { username, password } = req.query;

    // 调用登录函数
    const result = login(username, password);

    // 根据登录结果返回相应的模型对象
    return result.then((data) => {
      // 如果data不是空对象，则登录成功
      if (data.username) {
        // 设置 session
        req.session.username = data.username;
        req.session.realname = data.realname;

        // 同步到 redis
        set(req.sessionId, req.session);

        return new SuccessModel();
      }

      // 否则登录失败
      return new ErrorModel("登陆失败");
    });
  }
};

module.exports = handleUserRouter;
