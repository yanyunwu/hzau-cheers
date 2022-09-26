import Router from 'koa-router'
import {
  getAllReport,
  getUserInfoByUid,
  getDialogue,
  handleReport,
  setUserState
} from '../controller/admin'


const app = new Router()

// 获取所有举报信息
app.get('/getAllReport', getAllReport)
app.get('/getUserInfoByUid/:uid', getUserInfoByUid)
app.get('/getDialogue/:did', getDialogue)
app.post('/handleReport/:rid', handleReport)
app.post('/setUserState', setUserState)

export default app.routes();