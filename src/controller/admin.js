import { getUserInfo } from '../utils/sql'

/**
 * 后台管理操作
*/

// 获取所有举报信息
export async function getAllReport(ctx) {
  const sql = `SELECT ur.*, user.nickname, user.username FROM user_report AS ur
  LEFT JOIN user ON ur.uid=user.uid
  `
  const result = (await ctx.pool.execute(sql))[0]

  ctx.success('获取所有举报信息成功！', result)
}

// 获取单个对话信息
export async function getDialogue(ctx) {
  const sql = `SELECT * FROM user_dialogue_msg WHERE did=?`
  const result = (await ctx.pool.execute(sql, [ctx.params.did]))[0]

  ctx.success('获取对话信息成功', result)
}

// 设置用户账户状态
export async function setUserState(ctx) {
  const sql = `UPDATE user SET state=? WHERE uid=?`
  const result = (await ctx.pool.execute(sql, [
    ctx.request.body.state,
    ctx.request.body.uid,
  ]))[0]
  ctx.success('设置成功')
}

export async function getUserInfoByUid(ctx) {
  const result = await getUserInfo(ctx.params.uid)
  ctx.success('获取成功！', result)
}

export async function handleReport(ctx) {
  const sql = `UPDATE user_report SET status=1 WHERE rid=?`
  await ctx.pool.execute(sql, [ctx.params.rid])
  ctx.success('处理成功')
}