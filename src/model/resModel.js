/**
 * 用户返回结果的数据模型，在外部使用传入 数据或者错误信息
 *
 * 定义一个父类，处理通用数据
 * 成功子类继承父类，并且做出自己的处理
 */
class BaseModel {
  constructor(data, message) {
    // 到数据为字符串那么把值赋值给 message 消息
    // 这是只传了一个参数的情况
    if (typeof data === "string") {
      this.message = data;
      data = null;
      message = null;
    }

    // 有数据，且为正常数据
    if (data) {
      this.data = data;
    }

    // 文本提示
    if (message) {
      this.message = message;
    }
  }
}

class SuccessModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = 0;
  }
}

class ErrorModel extends BaseModel {
  constructor(data, message) {
    super(data, message);
    this.errno = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
};
