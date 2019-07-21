module.exports = () => {
  return async (ctx, next) => {
    let authorization = ctx.request.header.authorization;
    if(!authorization){
      ctx.body = {
        code: 1,
        data:{},
        error: 400,
        mes: '没有权限请求'
      }
      return;
    }
    authorization = authorization.split(' ')[1];
    try{
      let data = await ctx.app.jwt.verify(authorization, ctx.app.config.jwt.secret);
      console.log('data', data);
    }catch(err){
      console.log('error', err);
      if(err.name === 'TokenExpiredError'){
        // 过期把数据库中也清除
        // await service.actionToken.deleteToken({userId: payload._id});
        ctx.app.jwt.decode(authorization, async function(err, data){
          if(err){
            await service.actionToken.deleteToken({userId: data.data._id});
          }
        })
        ctx.body = {
          code: 1,
          data:{},
          error: 401,
          mes: '登录已过期，请重新登录'
        }
        return;
      }
    }
    
    await next();
  }
}