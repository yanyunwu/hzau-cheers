import Koa from 'koa'
import http from 'http'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import path from 'path'
import pool from './src/utils/mysql'
import Result from './src/utils/result'
import router from './src/main'
import { verifyToken } from './src/utils/jwt'
import { io } from './src/socket/index'
import config from './config.json'



const app = new Koa()
app.use(bodyParser())
app.use(new Result().callback())

app.use(
  koaStatic(path.resolve(__dirname, '../public'))
)

// 挂载数据库连接池
app.use(async (ctx, next) => {
  ctx.pool = pool
  await next()
})

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.fail(err.message || '服务器出现错误！', err)
  }
})

const WHITE_URL = ['/user/login', '/user/register', '/isProduction']
app.use(async (ctx, next) => {
  // await next()
  // return

  let index = WHITE_URL.indexOf(ctx.path)
  if (index > -1) {
    await next()
    return;
  }


  let token = ctx.header['token'];
  const userData = verifyToken(token);
  if (userData) {
    ctx.userData = userData;
    await next();
  } else {
    ctx.fail('用户信息验证失败！')
  }
})



app.use(router.routes()) // 安装主路由
app.use(router.allowedMethods())


const server = http.createServer(app.callback());
/** socket部分 */
io.attach(server)
server.listen(config.port, () => console.log(`远程地址：http://localhost:${config.port}/`))
