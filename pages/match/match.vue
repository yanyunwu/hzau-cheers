<template>
	<view class="match_outer">
		<image :src="bg" class="index_bg"></image>
<!-- 		<uni-section title="文字滚动"  type="line" > -->
					<uni-notice-bar show-icon scrollable :style="style"
						text="华中农cheers正式上线运营!欢迎各位体验评测!" />
		<!-- </uni-section> -->
		
		<view class="match_card">
			
			<view class="match_img">
				<uni-swiper-dot :info="info" :current="current" field="content" mode="round">
					<swiper class="swiper-box" @change="change">
						<swiper-item v-for="(item ,index) in info" :key="index">
							<image :src="item" mode="" style="width: 100%;"></image>
						</swiper-item>
					</swiper>
				</uni-swiper-dot>
			</view>
			
			<view style="display: flex;justify-content: center;padding: 30rpx 0;" :style="style">
				<uni-data-checkbox  mode="button" v-model="sex" :localdata="sexs" style="margin: auto;"></uni-data-checkbox>
			</view>
			
			<view style="display: flex;align-items: center;justify-content: center;">
				<view v-if="isProduction">
					<text>标签匹配</text>
					<view><van-switch :checked="isMatchTag" @change="switchTag"/></view>
				</view>
				<view style="width: 60%;padding-left: 30rpx;">
					<van-button v-if="isProduction" round :type=" isMatchTag ? 'primary' :'info'" size="large" @click="startMatch" loading-text="疯狂匹配中..." :loading="loading">{{isMatchTag ? '标签匹配' : '普通匹配'}}</van-button>
					<van-button v-else round type="info" size="large" @click="handleTologin">跳转登录</van-button>
				</view>
			</view>
			
			<view style="margin-top: 20rpx;padding: 0 50rpx;" :style="style">
				<van-button v-if="loading" round type="danger" size="large" style="margin-top: 10rpx;" @click="cancleMatch">取消匹配</van-button>
				<uni-notice-bar 
				v-else
				text="(我的页面可以设置标签)普通匹配只根据性别匹配,标签匹配根据你的标签匹配有交集的人(只含一个就能匹配到),性别为保密的只能匹配全部" />
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
	import {getStatus,getUserInfo as getUserInfoApi} from '@/api/index.js'
	import config from '@/config.js'
	const baseUrl = config.wsBaseUrl
	
	let p1 =  'https://hzau-online.oss-cn-hangzhou.aliyuncs.com/poster.jpg'
	export default {
		data() {
			return {
				bg: 'https://hzau-online.oss-cn-hangzhou.aliyuncs.com/12.jpg',
				
				isProduction: false,
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
				info: [p1,p1,p1],
				isMatchTag: false,
				room: undefined
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
				
				getUserInfoApi().then(value=>{
					if(value.data.state) {
						uni.showModal({
							title: '提示',
							content: '你的账户已被封禁，无法匹配！',
							showCancel:false
						});
						return
					}
					
					this.loading = true
					this.room = undefined
					this.initSocket()
				})
				
			},
			initSocket() {
				const socketpre = io(baseUrl, {
				  query: {},
				  transports: [ 'websocket', 'polling' ],
				  timeout: 5000,
				});
				
				// 初始化socket
				const socket = new SocketEmitter(socketpre)
				socketConfig.socket = socket
				
				// 监听匹配成功事件
				socket.on('match success', (value) => {
					socket.otherInfo = value.otherInfo
					this.room = value.room
					uni.navigateTo({
						url:`/pages/chat/chat?room=${value.room}&did=${value.did}` 
					})
					console.log(`匹配成功，房间号：${value.room}`);
					this.loading = false
				})
				
				// socket身份验证失败事件
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
				
				socket.on('error', (msg) => {
				  this.loading = false
				  socket.socket.close()
				  console.log('ws error', msg);
				});
				
				// 建立连接
				socketpre.on('connect', () => {
				  console.log('ws 已连接');
					
				  socketpre.emit('init user', getUserInfo().resData, this.room)
				  socket.on('init success', () => {
					  // 如果没有加载说明是在重连
					  if(this.loading) {
						  // 连接后开始匹配
						  socket.emit('match', {
							  isMatchTag: this.isMatchTag,
							  wantSex: this.sex
						  })
					  }else {
						  socket.emit('reset')
					  }
				  })
				 
				});
			},
			
			cancleMatch() {
				socketConfig.socket.socket.close()
				this.loading = false
			},
			change(e) {
				this.current = e.detail.current;
			},
			
			switchTag(e) {
				if(this.loading) {
					uni.showModal({
						content:'正在加载中就不要切换喽！',
						showCancel:false
					})
					return
				}
				this. isMatchTag = e.detail
			},
			
			
			handleTologin() {
				toLogin()
			}
			
			
		},
		
		created() {
			getStatus().then(value => {
				this.isProduction = value.data.isProduction
			})
		},
		
		computed:{
			style() {
				return this.isProduction ? 'visibility: visible;' : 'visibility: hidden;'
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
	height: calc(100% - 130rpx);
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
	margin-top: 20%;
	border-radius: 50rpx;
	overflow: hidden;
}

</style>
