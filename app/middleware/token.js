module.exports = () => {
  return async (ctx, next) => {
    console.log('执行到了这里');
    let authorization = ctx.request.header.authorization;
    if(!authorization){
      ctx.body = {
        code: 1,
        mes: '没有权限请求'
      }
      return;
    }

    let result = ctx.app.jwt.verify(authorization, ctx.app.config.jwt.secret , async function(err,data){
      if(err) {
        

        if(err.name === 'TokenExpiredError'){
          // 过期把数据库中也清除
          // await service.actionToken.deleteToken({userId: payload._id});
          ctx.app.jwt.decode(authorization, async function(err, data){
            if(err){
              console.log(err);
              await service.actionToken.deleteToken({userId: data.data._id});
            }
          })
          ctx.body = {
            code: 1,
            mes: '登录已过期，请重新登录'
          }
          return;
        }
      }
      
      await next();

    });
    
  }
}