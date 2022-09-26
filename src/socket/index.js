import { Server } from 'socket.io'
import { SocketEmitter } from '../utils/socket'
import { createDialogue, User, WaitingRoom, storeMessage } from './user'
import { getAllUserTagId, getUserInfo } from '../utils/sql'

export const io = new Server();

const waitingRoom = new WaitingRoom();


// 服务器监听连接事件
io.on('connection', (socketpre) => {
  console.log('----------');
  console.log("有新的socket加入：" + socketpre.id);

  socketpre.on('disconnect', () => {
    console.log('----------');
    console.log(socketpre.id + "已下线");
  })

  socketpre.on('init user', (userStoreData, room) => {
    initUser(socketpre, userStoreData, room)
  })
});




async function initUser(socketpre, userStoreData, room) {
  // 初始化一个user
  const userData = await getUserInfo(userStoreData.uid)
  const socket = new SocketEmitter(socketpre)
  let user = new User(socket, userData);


  // 如果socket下线就清除
  socket.socket.on('disconnect', () => {
    waitingRoom.removeWaitingUser(user)
  })

  // 给socket提供发送room消息的能力
  socket.on('send room message', (value, { uid }) => {
    //检测自己是否在房间 不在就加入
    socket.socket.join(value.room)
    socket.socket.to(value.room).emit('room message', {
      room: value.room,
      msg: value.msg
    })
    storeMessage(value.did, uid, value.msg)
  })



  socket.on('reset', () => {
    socket.socket.on('disconnect', () => {
      if (room) {
        io.to(room).emit('not online')
      }
    })
  })


  // 监控开启匹配事件
  socket.on('match', async (params, userStoreData) => {
    infoMatchStart(socket.socket.id)
    user.isMatchTag = params.isMatchTag
    user.wantSex = params.wantSex
    const userTagIdList = (await getAllUserTagId(userStoreData.uid)).map(item => item.lid)
    user.userData.userTagIdList = userTagIdList
    let matchedUser = waitingRoom.matchOneUser(user)

    // 如果没匹配到人就把自己放到等待队列
    if (!matchedUser) {
      waitingRoom.addWaitingUser(user)
      return
    }

    const did = await createDialogue(user, matchedUser)

    infoMatchSuccess(user, matchedUser)

    // 匹配到人之后就返回结果
    let room = 'room' + Date.now();

    // 如果掉线则互相通知对方
    user.socket.socket.on('disconnect', () => {
      io.to(room).emit('not online')
    })

    matchedUser.socket.socket.on('disconnect', () => {
      io.to(room).emit('not online')
    })

    user.socket.socket.join(room)
    matchedUser.socket.socket.join(room)
    user.socket.emit('match success', { room, did, otherInfo: matchedUser.userData })
    matchedUser.socket.emit('match success', { room, did, otherInfo: user.userData })
  })

  socket.emit('init success')
}


// 日志打印
function infoMatchStart(id) {
  console.log('----------');
  console.log(id + ' match start');
}

// 日志打印
function infoMatchSuccess(user, wuser) {
  console.log('----------');
  console.log('user:', {
    wantSex: user.wantSex,
    sex: user.userData.sex,
    isMatchTag: user.isMatchTag,
    tags: user.userData.userTagIdList
  });
  console.log('wuser:', {
    wantSex: wuser.wantSex,
    sex: wuser.userData.sex,
    isMatchTag: wuser.isMatchTag,
    tags: wuser.userData.userTagIdList
  });
}


