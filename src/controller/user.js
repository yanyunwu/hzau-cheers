import { getAllUserTagId, getUserInfo as sql_getUserInfo } from '../utils/sql'
import { verifier } from '../utils/verifier'

export function login(ctx) {

}

export function register(ctx) {

}

export async function signIn(ctx) {
  const userData = ctx.userData
  const sql = `SELECT sign_date, star from user WHERE uid=?`
  const result = (await ctx.pool.execute(sql, [userData.uid]))[0]

  const date = new Date()
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  const signDate = result[0].sign_date
  const star = result[0].star
  const curDate = `${year}-${month}-${day}`

  if (signDate === curDate) {
    ctx.fail('你已经今天已经签到过啦，明天再来吧')
    return
  }

  const sql_sign = `UPDATE user SET sign_date=?, star=? WHERE uid=?`
  const result_sign = (await ctx.pool.execute(sql_sign, [curDate, star + 5, userData.uid]))[0]

  ctx.success('签到成功，加5颗星星！')

}


export async function getUserInfo(ctx) {
  const userData = ctx.userData

  const sql = `SELECT * FROM user WHERE uid=?`
  const result = (await ctx.pool.execute(sql, [userData.uid]))[0]

  ctx.success('获取成功！', result[0])
}


// 用户修改信息接口
export async function putUserInfo(ctx) {
  verifier(ctx, {
    body: {
      age: { type: "number", required: true },
      sex: { type: "number", required: true },
      nickname: { type: "string", required: true },
    }
  })

  const body = ctx.request.body

  if (!body.nickname) {
    ctx.fail('昵称不能为空')
    return
  }


  const sql = `UPDATE user SET nickname=?, age=?,sex=? WHERE uid=?`
  let result = await ctx.pool.execute(sql, [
    body.nickname,
    body.age,
    body.sex,
    ctx.userData.uid
  ])
  ctx.success('修改成功！')
}


// 获取用户选择的标签列表
export async function getAllTagId(ctx) {
  let result = await getAllUserTagId(ctx.userData.uid)
  ctx.success('获取成功！', result)
}

// 设置用户选择的标签
export async function setTags(ctx) {
  const uid = ctx.userData.uid
  const sql_del = `DELETE FROM user_label WHERE uid=?`
  let result_del = (await ctx.pool.execute(sql_del, [uid]))[0]

  const lidList = ctx.request.body.lidList

  if (!lidList.length) {
    ctx.success('设置成功！')
    return
  }



  const sql_values = lidList.map(lid => `(?,?)`).join(',')
  const sql_params = lidList.map(lid => [uid, lid]).flat(1)

  const sql = `INSERT INTO user_label(uid, lid) VALUES ${sql_values}`
  let result = (await ctx.pool.execute(sql, sql_params))[0]

  ctx.success('设置成功！')
}


export async function addGood(ctx) {
  const sql = `UPDATE user SET good=good+1 WHERE uid=?`
  let result = (await ctx.pool.execute(sql, [ctx.params.uid]))[0]
  ctx.success('点赞成功')
}

export async function addlike(ctx) {
  const sql = 'UPDATE user SET `like`=`like`+1 WHERE uid=?'
  let result = (await ctx.pool.execute(sql, [ctx.params.uid]))[0]
  ctx.success('喜欢成功')
}

export async function addStar(ctx) {
  let userData = await sql_getUserInfo(ctx.userData.uid)

  if (userData.star <= 0) {
    ctx.fail('你的星星不足，无法赠送！')
    return
  }

  const sql_user = `UPDATE user SET star=star-1 WHERE uid=?`
  const sql_nuser = `UPDATE user SET star=star+1 WHERE uid=?`
  let result_user = (await ctx.pool.execute(sql_user, [ctx.userData.uid]))[0]
  let result_nuser = (await ctx.pool.execute(sql_nuser, [ctx.params.uid]))[0]
  ctx.success('赠送成功')
}

/**
 * 留言模块
*/

// 留言接口
export async function leaveMsg(ctx) {
  const body = ctx.request.body
  const sql = `INSERT INTO user_leave_msg(did, uid, uid_for, text) VALUES (?,?,?,?)`
  const result = (await ctx.pool.execute(sql, [
    body.did,
    body.uid,
    ctx.userData.uid,
    body.text
  ]))[0]

  ctx.success('留言成功！')
}

// 获取留言信息
export async function getLeaveMsg(ctx) {
  const sql = `SELECT ulm.*, user.username AS username_for, user.nickname AS nickname_for FROM user_leave_msg AS ulm 
  LEFT JOIN user ON ulm.uid_for = user.uid
  WHERE ulm.uid=?`
  const result = (await ctx.pool.execute(sql, [ctx.userData.uid]))[0]

  ctx.success('获取成功', result)
}

// 删除留言
export async function delLeaveMsg(ctx) {
  const sql = `DELETE FROM user_leave_msg WHERE mlid=?`
  const result = (await ctx.pool.execute(sql, [ctx.params.mlid]))[0]

  ctx.success('删除留言成功！')
}

/**
 * 举报模块
*/

// 用户举报
export async function report(ctx) {
  const body = ctx.request.body

  const sql = `INSERT INTO user_report(uid, uid_be, did, rtime) VALUES (?,?,?,NOW())`
  const result = (await ctx.pool.execute(sql, [
    ctx.userData.uid,
    body.uid,
    body.did
  ]))[0]

  ctx.success('举报成功')
}
