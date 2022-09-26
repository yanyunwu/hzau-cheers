
export function verifier(ctx, rules) {
  if (rules.body) {
    for (let key in rules.body) {
      if (!rules.body[key].required) continue

      if (typeof ctx.request.body[key] !== rules.body[key].type) {
        ctx.throw({ message: '参数类型错误' })
      }
    }
  }
}