class Result {

  callback() {
    return async function (ctx, next) {
      ctx.success = Result.success.bind(ctx)
      ctx.fail = Result.fail.bind(ctx)
      await next()
    }
  }

  static success(info, data) {
    this.body = {
      flag: true,
      info: info,
      data: data
    }
  }

  static fail(info, data) {
    this.body = {
      flag: false,
      info: info,
      data: data
    }
  }

}

export default Result