

export async function getAllTag(ctx) {
  const sql = `SELECT * FROM label`
  const result = (await ctx.pool.execute(sql))[0]

  ctx.success('获取成功', result)
}