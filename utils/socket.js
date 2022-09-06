import {getToken} from './token'

export const socketConfig = {
	socket: null
}

export class SocketEmitter {
  constructor(socket) {
    this.socket = socket
  }

  on(event, fn) {
    this.socket.on(event, fn)
  }

  emit(event, ...args) {
	let value = {
		token: getToken(),
		data: args
	}
    this.socket.emit(event, value)
  }
}