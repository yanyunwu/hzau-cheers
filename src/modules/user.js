import Router from 'koa-router'
import { verifier } from '../utils/verifier'
import { getToken } from '../utils/jwt'
import {
  signIn,
  getUserInfo,
  putUserInfo,
  getAllTagId,
  setTags,
  addGood,
  addlike,
  addStar,
  leaveMsg,
  getLeaveMsg,
  delLeaveMsg,
  report
} from '../controller/user'

const app = new Router()

// 用户登录接口
app.post('/login', async (ctx, next) => {
  verifier(ctx, {
    body: {
      username: { type: "string", required: true },
      password: { type: "string", required: true }
    }
  })

  let body = ctx.request.body
  const sql = `SELECT * FROM user WHERE username=?`
  let result = (await ctx.pool.execute(sql, [body.username]))[0]

  if (!result.length) {
    ctx.fail('你输入的用户名还没注册呢！')
    return
  }

  let userData = result[0]
  if (userData.password === body.password) {
    let resData = {
      uid: userData.uid,
      uuid: userData.uuid,
      username: userData.username,
      nickname: userData.nickname,
      power: userData.power,
      sex: userData.sex
    }
    let token = getToken(resData)
    ctx.success('登录成功!', { token, resData })
  } else {
    ctx.fail('你输入的密码不对哦！')
  }
})




// 用户注册接口
app.post('/register', async (ctx) => {
  verifier(ctx, {
    body: {
      name: { type: "string" },
      age: { type: "number", required: true },
      sex: { type: "number", required: true },
      username: { type: "string", required: true },
      nickname: { type: "string", required: true },
      password: { type: "string", required: true }
    }
  })
  let body = ctx.request.body

  if (!(body.username && body.password && body.nickname)) {
    ctx.fail('用户名和密码和昵称都不能为空')
    return
  }

  // 监测用户名是否已经存在
  const sql_is_exit = `SELECT * FROM user WHERE username=?`
  let result_is_exit = (await ctx.pool.execute(sql_is_exit, [body.username]))[0]
  if (result_is_exit.length) {
    ctx.fail('用户名已存在')
    return
  }



  const sql_max = 'SELECT MAX(uuid) AS max FROM user'
  let result_max = (await ctx.pool.execute(sql_max))[0]
  let max = result_max[0].max
  const sql = `INSERT INTO user(uuid, username, password, nickname, age, name, sex) 
  VALUES (?,?,?,?,?,?,?)
  `
  let result = await ctx.pool.execute(sql, [
    max + 1,
    body.username,
    body.password,
    body.nickname,
    body.age,
    body.name,
    body.sex
  ])

  ctx.success('注册成功')
})

app.get('/getUserInfo', getUserInfo)
app.post('/signIn', signIn)
app.post('/putUserInfo', putUserInfo)
app.get('/getAllTagId', getAllTagId)
app.post('/setTags', setTags)

app.post('/addGood/:uid', addGood)
app.post('/addlike/:uid', addlike)
app.post('/addStar/:uid', addStar)

app.post('/leaveMsg', leaveMsg)
app.get('/getLeaveMsg', getLeaveMsg)
app.post('/delLeaveMsg/:mlid', delLeaveMsg)

app.post('/report', report)
export default app.routes();