<template>
	<view>
		<view class="chat_message_list">
			
			
			<view>
				<uni-popup ref="popup" type="center">
					<uni-popup ref="message" type="message">
						<uni-popup-message :type="messageType"  :message="messageText" :duration="messageLong"></uni-popup-message>
					</uni-popup>
					<view class="chat_popup">
						<text>对于{{otherInfo.nickname}},你想？</text>
						<button @click="handleGood">点赞</button>
						<button @click="handleLike">喜欢他/她</button>
						<button @click="handleStar">送星星</button>
						<button @click="handleReport">举报</button>
						<button @click="handleMessage">留言</button>
					</view>
				</uni-popup>
			</view>

			<scroll-view scroll-y="true" style="height: calc(100vh - 95rpx);" 
				:scroll-top="scrollTopHeight" scroll-with-animation="true">
				<view v-for="item in messageList" >
					
					<view v-if="item.type === 'self'" class="chat_message_item chat_message_self">
						<image :src="selfimg"  style="width: 80rpx;height: 80rpx;"></image>
						<view>
							<view><text>{{item.nick}}</text></view>
							<view class="chat_message_text"><text>{{item.text}}</text></view>
						</view>
					</view>
					
					<view v-else-if="item.type === 'other'" class="chat_message_item chat_message_other">
						<image :src="selfimg"  style="width: 80rpx;height: 80rpx;" @click="handleSelectOther"></image>
						<view>
							<view><text>{{item.nick}}</text></view>
							<view class="chat_message_text"><text>{{item.text}}</text></view>
						</view>
					</view>
					
					<view v-else class="message_system">
						<view>
							{{item.text}}
						</view>
					</view>
					
				</view>
				
				
			</scroll-view>
		</view>
		
		<view class="chat_send" >
			<view style="display: flex; align-items: center;padding: 0 10rpx;">
				<view class="chat_send_input">
					<input type="text" v-model="waitMsg" />
				</view>
				<van-button type="primary" size="small" @click="sendMsg">发送</van-button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {socketConfig} from '@/utils/socket.js'
	import {getUserInfo} from '@/utils/token.js'
	import {addGood,addStar,addlike, leaveMsg, report} from '@/api/index.js'
	export default {
		data() {
			return {
				messageList: [
					{
						type: 'system',
						text: '你们已经匹配成功，说点什么吧'
					},
				],
				selfimg: "../../static/girl.png",
				waitMsg: "",
				room: undefined,
				did: null,

				scrollTopHeight: 0,
				
				myInfo: {
					
				},
				
				otherInfo: {
					
				},
				
				messageType: 'success',
				messageText: '',
				messageLong: 2000,
				
				
				hasLike: false,
				hasReport: false,
				
			}
		},
		methods: {
			addMineMsg(msg) {
				this.messageList.push({
					nick: this.myInfo.nickname,
					type: 'self',
					text: msg
				})
				this.setTopHeight()
			},
			
			addOtherMsg(msg) {
				this.messageList.push({
					nick: this.otherInfo.nickname,
					type: 'other',
					text: msg
				})
				this.setTopHeight()
			},
			
			sendMsg() {
				if(!this.waitMsg) return
				
				this.addMineMsg(this.waitMsg)

				socketConfig.socket.emit('send room message', {
					room: this.room,
					 msg:this.waitMsg, 
					 did:this.did
				})
				this.waitMsg = ""
				
			},
			setTopHeight() {
				this.$nextTick(()=>{
					this.scrollTopHeight = this.scrollTopHeight+100
				})
			},
			
			handleSelectOther() {
				this.$refs.popup.open()
			},
			
			message(type = 'success', text = '', duration = 2000) {
				this.messageType = type
				this.messageText = text,
				this.messageLong = duration
				this.$refs.message.open()
			},
			
			
			handleGood() {
				addGood(this.otherInfo.uid).then(value => {
					this.message('success', '点赞成功！')
				}).catch(err => {
					this.message('error', '点赞失败！')
				})
				
			},
			
			handleLike() {
				addlike(this.otherInfo.uid).then(value => {
					this.message('success', 'TA已经收到你的喜欢了！')
				}).catch(err => {
					this.message('error', '操作失败！')
				})
			},
			handleStar() {
				
				addStar(this.otherInfo.uid).then(value => {
					this.message('success', 'TA的星星+1！')
				}).catch(err => {
					this.message('error', err.info)
				})
			},
			handleReport() {
				report(this.otherInfo.uid, this.did).then(value=> {
					this.message('info', '举报成功，审核员将会在近期审核处理', 3000)
				}).catch(err => {
					this.message('error', '举报失败，请重试')
				})
				
			},
			handleMessage() {
				uni.showModal({
					title: "请输入留言内容",
					editable: true,
					success:(res) => {
						let text = res.content
						if(!text) {
							this.message('info', '留言不能为空！')
							return
						}
						
						this.handleLeaveMsgSubmit(text)
					}
				})
			},
			handleLeaveMsgSubmit(text) {
				leaveMsg(this.did,this.otherInfo.uid, text).then(value => {
					this.message('success', '留言成功！')
				}).catch(err => {
					this.message('error', '留言失败！')
				})
			}
		},
		created() {
			const userInfo = getUserInfo()
			userInfo && (this.myInfo = userInfo.resData)
			this.otherInfo = socketConfig.socket.otherInfo || {}
			
			uni.setNavigationBarTitle({
			    title: `和${this.otherInfo.nickname}的对话`
			});

			
			socketConfig.socket.on('room message', (value) => {
			  console.log(`${value.room}: ${value.msg}`);
			  this.addOtherMsg(value.msg)
			})
			
			socketConfig.socket.on('not online', () => {
		
					uni.showModal({
						content: '对方可能掉线了，要继续等TA吗？或者可以点击头像留言',
						success: function (res) {
							if (res.cancel) {
								uni.navigateBack()
							}
						},
						cancelText: '直接退出',
						confirmText: '继续等TA'
					})
				
			})
			
		},
		onLoad(options){
			this.room = options.room
			this.did = options.did
			this.scrollTopHeight = this.messageList.length * 100
		},
		onUnload() {
			socketConfig.socket.socket.close()
			socketConfig.socket = null
		},
		onShow() {
			let socket  =socketConfig.socket
			if(socket.socket.disconnected){
				socket.socket.connect()
			}
		}
		
	}
</script>

<style>
	.chat_message_list {
		width: 100%;
		height: 50%;
		background-color: #F1F1F1;
		overflow: hidden;
	}
	
	.chat_message_item {
		display: flex;
		padding: 10rpx 15rpx;
	}
	
	.chat_message_item .chat_message_text {
		height: 60rpx;
		background-color: white;
		border-radius: 10rpx;
		line-height: 60rpx;
		text-align: center;
		padding: 5rpx 20rpx;
		margin-top: 15rpx;
	}
	
	.chat_message_self>view {
		margin-right: 20rpx;
	}
	
	.chat_message_self>view>view:first-child {
		text-align: right;
	}
	
	
	.chat_message_other>view {
		margin-left: 20rpx;
	}
	
	.chat_message_self {
		flex-direction: row-reverse;
	}
	
	
	.chat_message_other {

	}
	
	.chat_send {
		width: 100%;
		position: fixed;
		bottom: 20rpx;
		padding-top: 5rpx;
		background-color: white
	}
	
	.chat_send .chat_send_input {
		height: 75rpx;
		background-color: #F1F1F1;
		flex: 1;
		margin: 0 10rpx;
	}
	
	.chat_send input {
		height: 100%;
		line-height: 30rpx;
		padding: 0 10rpx;
	}
	
	.chat_popup {
		width: 350rpx;
		background-color: white;
		padding: 20rpx;
		text-align: center;
		border-radius: 20rpx;
	}
	.chat_popup button {
		margin: 10rpx;
	}
	
	.message_system > view{
		margin: 30rpx 20%;
		background-color: rgba(0, 0, 0, .5);
		color: white;
		border-radius: 10rpx;
		text-align: center;
	}

</style>
