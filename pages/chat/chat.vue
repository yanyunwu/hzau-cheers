<template>
	<view>
		<view class="chat_message_list">
			<scroll-view scroll-y="true" style="height: calc(100vh - 95rpx);" 
				:scroll-top="scrollTopHeight" scroll-with-animation="true">
				<view v-for="item in messageList">
					
					<view v-if="item.type === 'self'" class="chat_message_item chat_message_self">
						<image :src="selfimg"  style="width: 80rpx;height: 80rpx;"></image>
						<view>
							<view><text>{{item.nick}}</text></view>
							<view class="chat_message_text"><text>{{item.text}}</text></view>
						</view>
					</view>
					
					<view v-else class="chat_message_item chat_message_other">
						<image :src="selfimg"  style="width: 80rpx;height: 80rpx;" @click="handleSelectOther"></image>
						<view>
							<view><text>{{item.nick}}</text></view>
							<view class="chat_message_text"><text>{{item.text}}</text></view>
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
	export default {
		data() {
			return {
				messageList: [
					{
						nick: '小红',
						type: 'other',
						text: 'hello'
					},
					{
						nick: '小明',
						type: 'self',
						text: 'hi'
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
					
				}
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
				console.log(4324)
				this.$refs.popup.open('top')
			}
		},
		created() {
			const userInfo = getUserInfo()
			userInfo && (this.myInfo = userInfo.resData)
			this.otherInfo = socketConfig.socket.otherInfo
			
			socketConfig.socket.on('room message', (value) => {
			  console.log(`${value.room}: ${value.msg}`);
			  this.addOtherMsg(value.msg)
			})
			
		},
		onLoad(options){
			this.room = options.room
			this.did = options.did
			this.scrollTopHeight = this.messageList.length * 100
		},
		
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
		padding: 5rpx;
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

</style>
