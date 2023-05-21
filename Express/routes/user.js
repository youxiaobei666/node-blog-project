const express = require("express");
const router = express.Router();
const { login } = require("../controller/user");
const { SuccessModel, ErrorModel } = require("../model/resModel");
router.post("/login", (req, res, next) => {
  console.log(req.body);
  const { username, password } = req.body;
  const result = login(username, password);
  // 根据登录结果返回相应的模型对象
  return result.then((data) => {
    console.log(data);
    // 如果data不是空对象，则登录成功
    if (data.username) {
      // 设置 session
      req.session.username = data.username;
      req.session.realname = data.realname;
      // 同步到 redis
      res.json(new SuccessModel());
      return;
    }
    // 否则登录失败
    res.json(new ErrorModel("登陆失败"));
  });
});

router.get("/login-text", (req, res, next) => {
  console.log("req.session", req.session);
  if (req.session.username) {
    res.json({
      error: 0,
      message: "text-pass",
    });
    return;
  }
  res.json({
    error: -1,
    message: "text-faild",
  });
});

module.exports = router;
