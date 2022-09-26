import { verifyToken } from "./jwt"



export class SocketEmitter {
  constructor(socket) {
    this.socket = socket
  }

  on(event, fn) {
    let cb = (value = {}) => {
      let resData = verifyToken(value.token || '')
      if (resData) {
        fn(...value.data || [], resData)
      } else {
        this.socket.emit('auth', {
          reason: '你的身份验证已过期，请重新登录！'
        })
      }
    }
    this.socket.on(event, cb)
  }

  emit(event, ...args) {
    this.socket.emit(event, ...args)
  }
}