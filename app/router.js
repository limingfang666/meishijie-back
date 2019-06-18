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

};
