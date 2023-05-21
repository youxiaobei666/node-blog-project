/**
 * 用户返回结果的数据模型，在外部使用传入 数据或者错误信息
 *
 * 定义一个父类，处理通用数据
 * 成功子类继承父类，并且做出自己的处理
 */
class BaseModel {
  /**
   * 构造函数
   * @param {any} data - 数据
   * @param {string} message - 错误消息
   */
  constructor(data, message) {
    // 如果数据参数为字符串，则将其赋值给消息属性
    // 这种情况下只传入了一个参数
    if (typeof data === "string") {
      this.message = data;
      data = null;
      message = null;
    }

    // 如果有数据参数且数据正常
    if (data) {
      this.data = data;
    }

    // 如果有消息参数
    if (message) {
      this.message = message;
    }
  }
}

/**
 * 成功模型，继承自基础模型
 */
class SuccessModel extends BaseModel {
  /**
   * 构造函数
   * @param {any} data - 数据
   * @param {string} message - 错误消息
   */
  constructor(data, message) {
    super(data, message);
    this.errno = 0; // 错误号，0表示成功
  }
}

/**
 * 错误模型，继承自基础模型
 */
class ErrorModel extends BaseModel {
  /**
   * 构造函数
   * @param {any} data - 数据
   * @param {string} message - 错误消息
   */
  constructor(data, message) {
    super(data, message);
    this.errno = -1; // 错误号，-1表示错误
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
};
