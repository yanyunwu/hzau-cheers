import { EventEmitter } from 'events'
import pool from '../utils/mysql'

export class User extends EventEmitter {
  constructor(socket, userData) {
    super()
    this.socket = socket
    this.userData = userData
  }
}

export class WaitingRoom {
  constructor() {
    this.userList = []
  }

  matchOneUser(user) {
    if (!this.userList.length) return null


    for (let i = 0; i < this.userList.length; i++) {
      let wuser = this.userList[i]

      // 把不在线的踢除
      if (!isOnline(wuser) || user.userData.uid === wuser.userData.uid) {
        this.userList.splice(i, 1)
        i--
        continue
      }

      if (user.isMatchTag !== wuser.isMatchTag) {
        continue
      }

      if (user.isMatchTag) {
        if (isMatchSex(user, wuser) && isMatchTags(user, wuser)) {
          this.removeWaitingUser(wuser)
          return wuser
        } else {
          continue
        }
      } else {
        if (isMatchSex(user, wuser)) {
          this.removeWaitingUser(wuser)
          return wuser
        }
        else continue
      }
    }

    return null
  }

  addWaitingUser(wuser) {
    this.userList.push(wuser)
  }

  removeWaitingUser(user) {
    let index = this.userList.indexOf(user)
    if (index > -1) {
      this.userList.splice(index, 1)
    }
  }
}

export async function createDialogue(user, waituser) {
  const sql = `INSERT INTO user_dialogue(uid1, uid2, dstart_time) VALUES (?,?,NOW())`
  const result = (await pool.execute(sql, [user.userData.uid, waituser.userData.uid]))[0]
  return result.insertId
}

export async function storeMessage(did, uid, message) {
  const sql = `INSERT INTO user_dialogue_msg(did, uid, message, mtime) VALUES (?,?,?, NOW())`
  // 这里不需要等待
  pool.execute(sql, [did, uid, message])
}

// 监测是否性别匹配
function isMatchSex(user, wuser) {
  if (
    isMatchSexAone(user.wantSex, wuser.userData.sex)
    &&
    isMatchSexAone(wuser.wantSex, user.userData.sex)
  ) { return true }

  return false
}

function isMatchTags(user, wuser) {
  let userIds = user.userData.userTagIdList
  let wuserIds = wuser.userData.userTagIdList
  return !!userIds.filter(id => wuserIds.includes(id)).length
}

// 监测是否在线，不在线就删除
function isOnline(user) {
  return !user.socket.socket.disconnected
}

function isMatchSexAone(want, real) {
  if (want === 2) return true
  if (want === real) return true
  return false
}