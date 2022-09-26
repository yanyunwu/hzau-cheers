import mysql from 'mysql2/promise'
import { database } from '../../config.json'

let options = {
  host: database.host,
  database: database.database,
  port: database.port,
  user: database.user,
  password: database.password,
  waitForConnections: true, //连接超额是否等待
  connectionLimit: 10, //一次创建的最大连接数
  queueLimit: 0 //可以等待的连接的个数
}

const pool = mysql.createPool(options)

export default pool