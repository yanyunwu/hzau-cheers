const Koa = require('koa')
const http = require('http')
const { Server } = require('socket.io')

const app = new Koa()

const io = new Server();

io.on('connection', async (socket) => {
  socket.emit('aaa')
  // socket.on('msg', () => {
  //   io.to('qwe').emit('msg')
  // })
  // await socket.join('qwe')

  // console.log(await io.in('qwe').allSockets());


})


const server = http.createServer(app.callback())
io.attach(server)
server.listen(3333, () => {
  console.log("已启动");
})



