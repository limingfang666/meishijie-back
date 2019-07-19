'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  
  router.get('/', controller.home.index);


  const token = app.middleware.token();

  router.post('/user/create', controller.user.create);
  router.post('/user/login', controller.user.login);
  router.post('/user/login_out', token, controller.user.login_out);

  // 用户操作行为
  // 我关注的
  router.post('/user/following', controller.userAction.following);
  router.get('/user/following', controller.userAction.following);

  // 我收藏的
  router.post('/user/collection', controller.userAction.collection);
  router.get('/user/collection', controller.userAction.collection);

  // 菜谱相关
  router.post('/menu/publish', controller.menu.publish);
  router.get('/menu/query', controller.menu.query);
  router.get('/menu/classify', controller.menu.classify);
  router.get('/menu/property', controller.menu.property);



};
