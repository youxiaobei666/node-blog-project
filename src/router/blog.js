const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
} = require("../controller/blog"); // 导入列表获取方法
const { SuccessModel, ErrorModel } = require("../model/resModel"); // 导入响应数据模型

/**
 *
 * 统一登陆验证函数
 */
const loginCheck = (req) => {
  if (!req.session.username) {
    return Promise.resolve(new ErrorModel("请先登录"));
  }
};

const handleBlogRouter = (req, res) => {
  const method = req.method; // 获取请求方法
  const id = req.query.id;
  /**
   * 查询博客列表
   */
  if (method === "GET" && req.path === "/api/blog/list") {
    let author = req.query.author || "";
    const keyword = req.query.keyword || ""; // 从 query 获取 参数
    // const listData = getList(author, keyword); // 得到查询的数据
    // return new SuccessModel(listData); // 响应成功模型

    if (req.query.isadmin) {
      // 管理员页面
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) {
        // 未登陆
        return loginCheckResult;
      }
      // 强制查询自己的博客
      author = req.session.username;
    }

    const result = getList(author, keyword);
    return result.then((listData) => {
      return new SuccessModel(listData);
    });
  }
  /**
   * 查询博客详情
   */
  if (method === "GET" && req.path === "/api/blog/detail") {
    // const data = getDetail(id);
    // return new SuccessModel(data);
    const result = getDetail(id);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  /**
   * 新建博客
   */
  if (method === "POST" && req.path === "/api/blog/new") {
    // 登陆验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登陆
      return loginCheckResult;
    }

    req.body.author = req.session.username;
    const result = newBlog(req.body);
    return result.then((data) => {
      return new SuccessModel(data);
    });
  }

  /**
   *  更新博客
   */
  if (method === "POST" && req.path === "/api/blog/update") {
    // 登陆验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登陆
      return loginCheckResult;
    }
    const result = updateBlog(id, req.body);
    return result.then((flag) => {
      // 如果数据库操作的结果是 true
      if (flag) {
        return new SuccessModel();
      } else {
        return new ErrorModel("更新博客失败");
      }
    });
  }
  /**
   * 删除博客
   */
  if (method === "POST" && req.path === "/api/blog/del") {
    // 登陆验证
    const loginCheckResult = loginCheck(req);
    if (loginCheckResult) {
      // 未登陆
      return loginCheckResult;
    }
    const author = req.session.username;
    const result = delBlog(id, author);
    return result.then((flag) => {
      if (flag) {
        return new SuccessModel();
      }
      return new ErrorModel("删除失败");
    });
  }
};

module.exports = handleBlogRouter;
