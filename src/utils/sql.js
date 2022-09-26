import pool from './mysql'


export async function getAllUserTagId(uid) {
  const sql = `SELECT * FROM user_label WHERE uid=?`
  return (await pool.execute(sql, [uid]))[0]
}

export async function getUserInfo(uid) {
  const sql = `SELECT * FROM user WHERE uid=?`
  const result = (await pool.execute(sql, [uid]))[0]
  return result[0]
}