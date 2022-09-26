import Router from 'koa-router'
import config from '../config.json'

import UserModule from './modules/user'
import TagModule from './modules/tag'
import AdminModule from './modules/admin'


const app = new Router()
app.use('/user', UserModule)
app.use('/tag', TagModule)
app.use('/admin', AdminModule)


app.get('/', async (ctx, next) => {
  ctx.success('首页服务测试！success!')
})

app.get('/isProduction', (ctx) => {
  ctx.success('', {
    isProduction: config.isProduction
  })
})


export default app;