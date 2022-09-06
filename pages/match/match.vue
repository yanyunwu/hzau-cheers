<template>
	<view class="match_outer">
		<image :src="static+'12.jpg'" class="index_bg"></image>
		<view class="match_card">
			<view class="match_img">
				<!-- <image :src="static + 'poster.jpg'" mode="" style="width: 100%;"></image> -->
				<uni-swiper-dot :info="info" :current="current" field="content" mode="round">
					<swiper class="swiper-box" @change="change">
						<swiper-item v-for="(item ,index) in info" :key="index">
							<image :src="static + item" mode="" style="width: 100%;"></image>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>
			<view style="display: flex;justify-content: center;padding: 30rpx 0;">
				<uni-data-checkbox  mode="button" v-model="sex" :localdata="sexs" style="margin: auto;"></uni-data-checkbox>
			</view>
			<!-- <text>选择标签：</text> -->
			<!-- <view class="example-body">
				<view class="tag-view">
					<uni-tag text="标签" type="primary" />
				</view>
				<view class="tag-view">
					<uni-tag text="标签" type="success" />
				</view>
				<view class="tag-view">
					<uni-tag text="标签" type="warning" />
				</view>
				<view class="tag-view">
					<uni-tag text="标签" type="error" />
				</view>
				<view class="tag-view">
					<uni-tag text="标签" />
				</view>
			</view> -->
			<van-button round type="primary" size="large" @click="startMatch()" loading-text="疯狂匹配中..." :loading="loading">开始匹配</van-button>
			<view style="margin-top: 20rpx;" v-if="loading">
				<van-button round type="danger" size="large" style="margin-top: 10rpx;" @click="cancleMatch">取消匹配</van-button>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import io from '@hyoga/uni-socket.io';
	import {toLogin} from '@/utils/other.js'
	import {socketConfig} from '@/utils/socket.js'
	import {getUserInfo} from '@/utils/token.js'
	import {SocketEmitter} from '@/utils/socket.js'
	
	import config from '@/config.js'
	const baseUrl = config.wsBaseUrl
	export default {
		data() {
			return {
				loading: false,
				sex: 2,
				sexs: [{
					text: '匹配男生',
					value: 0
				}, {
					text: '匹配女生',
					value: 1
				}, {
					text: '全部',
					value: 2
				}],
				current: 0, 
				info: ['poster.jpg', 'poster.jpg', 'poster.jpg'],
						
			}
		},
		methods: {
			startMatch() {
				// 验证用户是否登录
				if(!getUserInfo()) {
					uni.showModal({
						title: '提示',
						content: '你还没有登录哦！',
						success: function (res) {
							if (res.confirm) {
								toLogin()
							}
						},
						confirmText: '去登陆',
						cancelText: '算了'
					});
					return
				}
				this.getSocket()
				this.loading = true
			},
			getSocket() {
				const socketpre = io(baseUrl, {
				  query: {},
				  transports: [ 'websocket', 'polling' ],
				  timeout: 5000,
				});
				
				// 初始化socket
				const socket = new SocketEmitter(socketpre)
				socketConfig.socket = socket
				
				// 建立连接
				socket.on('connect', () => {
				  console.log('ws 已连接');
				  
				  // 监听匹配成功事件
				  socket.on('match success', (value) => {
					socket.otherInfo = value.otherInfo
					uni.navigateTo({
						url:`/pages/chat/chat?room=${value.room}&did=${value.did}` 
					})
				    console.log(`匹配成功，房间号：${value.room}`);
					this.loading = false
				  })
				  
				  socket.on('auth', (value) => {
					  this.loading = false
					  socket.socket.close()
					  uni.removeStorageSync('user-info')
					  uni.showModal({
					  	title: '提示',
					  	content: (value && value.reason )|| '你的身份验证已过期，请重新登录！',
					  	success: function (res) {
					  		if (res.confirm) {
					  			toLogin()
					  		}
					  	}
					  });
				  })
				  
				  // 绑定其他连接断开事件
				  socket.on('disconnect', () => {
					this.loading = false
					socket.socket.close()
				  })
				  
				  // 连接后开始匹配
				  socket.emit('match')
				});
			
				
				socket.on('error', (msg) => {
				  console.log('ws error', msg);
				});
			},
			
			cancleMatch() {
				socketConfig.socket.socket.close()
				this.loading = false
			},
			change(e) {
				this.current = e.detail.current;
			},
			
		},
		
		created() {
			
		},
		
		computed:{
			static(){
				return this.$store.state.staticUrl
			}
		}
	}
</script>

<style>

.match_outer {
	height: 100vh;
	padding: 20rpx;
	padding-bottom: 10rpx;
	box-sizing: border-box;
}

.index_bg {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: -1;
}
	
.match_card {
	height: 100%;
	border-radius: 50rpx;
	box-shadow: 0 0 20px rgb(0 0 0 / 20%);
	padding: 20rpx;
	box-sizing: border-box;
	background-color: rgba(255, 255, 255, .5);
}

.example-body {
	display: flex;
	padding: 20rpx 0;
}
.tag-view {
	margin: 0 10rpx;
}

.match_img {
	margin-top: 30%;
	border-radius: 50rpx;
	overflow: hidden;
}
</style>
