const { io } = require('socket.io-client');

const url = "ws://localhost:3000"
// const url = "wss://online.codexx.cc"
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsI…2Mjd9.JVdOyac1C1S7vn2umSFd5wYu0jHhEfuUGrMJRzywi_I'
const socket = io(url, {
  reconnectionDelayMax: 10000,
});

let did = null

socket.on('match success', (room, didi) => {
  did = didi
  console.log(`匹配成功，房间号：${room}`);
  // socket.emit('send room message', {
  //   token: token,
  //   data: [room, '你好']
  // })
})

socket.on('room message', (room, msg) => {
  console.log(`${room}: ${msg}`);
  socket.emit('send room message', {
    token: token,
    data: [room, 'get:' + msg, did]
  })
})

socket.on('disconnect', () => {
  socket.close()
})


socket.emit('match', {
  token: token
})