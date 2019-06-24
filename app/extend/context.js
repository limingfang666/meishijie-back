module.exports = {
  returnBody(status=200, mes="成功", data={}){
    this.status = status;
    this.body = {
      status,
      mes,
      data
    }
  }
}