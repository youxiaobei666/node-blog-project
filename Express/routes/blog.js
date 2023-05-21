const express = require("express");
const router = express.Router();
const loginCheck = require("../middleware/loginCheck");
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog"); // 导入列表获取方法
const { SuccessModel, ErrorModel } = require("../model/resModel"); // 导入响应数据模型

// 获取博客列表
router.get("/list", (req, res, next) => {
  let author = req.query.author || "";
  const keyword = req.query.keyword || ""; // 从 query 获取 参数

  if (req.query.isadmin) {
    // 管理员页面
    if (req.session.username == null) {
      res.json(new ErrorModel("未登陆"));
      return;
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);
  return result.then((listData) => {
    res.json(new SuccessModel(listData));
  });
});

// 获取博客详情
router.get("/detail", (req, res, next) => {
  const result = getDetail(req.query.id);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});

// 新建
router.post("/new", loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then((data) => {
    res.json(new SuccessModel(data));
  });
});

// 更新
router.post("/uptate", loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("更新失败"));
    }
  });
});

// 删除
router.post("/del", loginCheck, (req, res, next) => {
  const author = req.session.username;
  const result = delBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel("删除博客失败"));
    }
  });
});

module.exports = router;
