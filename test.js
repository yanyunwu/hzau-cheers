const { io } = require('socket.io-client');

const socket = io('ws://localhost:3333', {
  reconnectionDelayMax: 10000,
});
socket.on('aaa', () => {
  console.log('aaa');
})

socket.on('connect', () => {
  console.log('client connect');
})




// socket.on('msg', () => {
//   console.log('有消息');
// })

// setTimeout(() => {
//   socket.emit('msg')
// }, 3000)

setTimeout(() => {
  socket.close()
}, 1000)

setTimeout(() => {
  socket.connect()
}, 3000)
