const { sqlFun } = require("../db/mysql");

/**
 *   获取博客列表
 *
 * @param {String} author - 作者名
 * @param {String} keyword - 关键词
 * @return {Array} 博客列表
 */
const getList = (author, keyword) => {
  // 处理sql语句
  let sql = `select * from blogs where 1 = 1 `; // 1=1 防止报错

  if (author) {
    sql += `and author = '${author}' `;
  }

  if (keyword) {
    sql += `and title like '%${keyword}%' `;
  }

  sql += `order by createtime desc;`;
  // 返回获取列表的 promise
  return sqlFun(sql);
};

/**
 * 获取博客详情
 *
 * @param {Number} id
 * @return {Object}
 */
const getDetail = (id) => {
  const sql = `select * from blogs where id = '${id}';`;
  return sqlFun(sql).then((rows) => {
    return rows[0];
  });
};

/**
 * 新建博客
 */
const newBlog = (blogData = {}) => {
  const author = blogData.author;
  const title = blogData.title;
  const content = blogData.content;
  const createtime = Date.now();

  const sql = `
    insert into blogs (title,content,createtime,author) 
    values ('${title}','${content}','${createtime}','${author}')
  `;

  // 将数据库操作的结果返回
  return sqlFun(sql).then((insertdata) => {
    return insertdata.insertId;
  });
};

/**
 * 更新博客
 */
const updateBlog = (id, blogData = {}) => {
  // 获取标题和内容
  const title = blogData.title;
  const content = blogData.content;
  // sql 语句
  const sql = `
    update blogs set title='${title}', content='${content}' where id=${id}
  `;
  return sqlFun(sql).then((updateDate) => {
    if (updateDate.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

/**
 * 删除博客
 */
const delBlog = (id, author) => {
  const sql = `
    delete from blogs where id='${id}' and author='${author}'
  `;
  return sqlFun(sql).then((deleteDate) => {
    if (deleteDate.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog,
};
