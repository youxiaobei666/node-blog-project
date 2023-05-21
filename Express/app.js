var createError = require("http-errors");
var express = require("express");
var path = require("path");
const fs = require("fs");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// session ,redis
const session = require("express-session"); // express-session
const { redisClient } = require("./db/redis"); // 导入redis客户端,已经完成了配置
const RedisStore = require("connect-redis").default; // 连接 redis 的 store

var app = express(); // 创建app实例

// 导入路由
const user = require("./routes/user");
const blog = require("./routes/blog");

// 视图相关无需使用
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

// 日志
const ENV = process.env.NODE_ENV;
if (ENV !== "production") {
  // 开发
  app.use(logger("dev"));
} else {
  // 上线
  const logFilePath = path.join(__dirname, "logs", "access.log");
  const writeStream = fs.createWriteStream(logFilePath, { flags: "a" });
  app.use(
    logger("combind", {
      stream: writeStream,
    })
  );
}

app.use(express.json()); // 解析请求的json格式
app.use(express.urlencoded({ extended: false })); // 解析请求的string格式
app.use(cookieParser()); // 解析请求的 cookie

// Initialize store.
let redisStore = new RedisStore({
  client: redisClient,
});
// 实现 session 功能
app.use(
  session({
    // store: redisStore,
    secret: "youxiaobei#123",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: false, // required: force lightweight session keep alive (touch)
    saveUninitialized: false, // recommended: only save session when data exists
  })
);

// 使用user路由
app.use("/api/user", user);
// 使用blog路由
app.use("/api/blog", blog);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "dev" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.send("404");
});

module.exports = app;
