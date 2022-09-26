import Router from 'koa-router'
import { getAllTag } from '../controller/tag'

const app = new Router()

app.get('/getAllTag', getAllTag)

export default app.routes();