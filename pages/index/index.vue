<template>
	<view class="index_container">
		<image :src="static+'13.jpg'" mode="" class="index_bg"></image>
		<view class="index_outer">
			<view class="index_header" @click="handlelogin">
				<image src="../../static/boy.png"  mode="widthFix"></image>
				<view style="padding-left: 50rpx;">
					<view style="font-weight: bold;font-size: 50rpx;">{{userInfo.nickname}}</view>
					<view style="padding-left: 1rpx;font-size: 28rpx;color: #777;">{{userInfo.username}}</view>
				</view>
			</view>
			<view class="index_header_bottom">
				<view class=""><text>{{userInfo.good}}</text><text>被赞</text></view>
				<view class=""><text>{{userInfo.like}}</text><text>喜欢</text></view>
				<view class=""><text>{{userInfo.star}}</text><text>星星</text></view>
			</view>
			
			<view class="index_middle">
				<view @click="handleSignIn">
					<image src="../../static/22.png" mode="widthFix"></image>
					<text>签到</text>
				</view>
				<view class="">
					<image src="../../static/17.png" mode="widthFix"></image>
					<text>账户</text>
				</view>
				<view class="">
					<image src="../../static/5.png" mode="widthFix"></image>
					<text>标签</text>
				</view>
				<view class="">
					<image src="../../static/4.png" mode="widthFix"></image>
					<text>待定</text>
				</view>
			</view>
			
			<view class="index_my">
				<view class="index_my_title">
					我的账户
				</view>
				<view class="index_my_body">
					<view><image src="../../static/2.png" mode="widthFix"></image><text>我的信息</text></view>
					<view><image src="../../static/14.png" mode="widthFix"></image><text>消息中心</text></view>
					<view><image src="../../static/21.png" mode="widthFix"></image><text>后台管理</text></view>
					<view @click="handleSetting"><image src="../../static/9.png" mode="widthFix" ></image><text>设置中心</text></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {signIn, getUserInfo} from '@/api/index.js'
	export default {
		data() {
			return {
				isLogin: false,
				
				userInfo: {
					nickname: '登录/注册',
					username: '登录后更加精彩!',
					good:0,
					like:0,
					star:0
				}
			}
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			handlelogin() {
				if(this.isLogin) return
				uni.navigateTo({
					url:"/pages/login/login"
				})
			},
			handleSetting() {
				uni.navigateTo({
					url:'/pages/setting/setting'
				})
			},
			handleSignIn() {
				signIn().then(value => {
					uni.showModal({
						title: '提示',
						content: value.info,
						showCancel:false
					});
				}).catch(err => {
					uni.showModal({
						title: '提示',
						content: err.info,
						showCancel:false
					});
				})
			},
			
			getUserInfo() {
				getUserInfo().then(value => {
					this.isLogin = true
					this.userInfo = value.data
				}).catch(err => {
					this.isLogin = false
					this.userInfo = {
						nickname: '登录/注册',
						username: '登录后更加精彩!',
						good:0,
						like:0,
						star:0
					}
				})
			}
		},
		computed:{
			static(){
				return this.$store.state.staticUrl
			}
		}
	}
</script>

<style>
	.index_outer {
		background-color: rgba(255, 255, 255, 0.85);
		height: 100vh;
	}
	
	.index_bg {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		z-index: -1;
	}
	
	.index_header {
		display: flex;
		align-items: center;
		padding: 50rpx;
	}
	
	.index_header image {
		width: 120rpx;
	}
	
	.index_header_bottom {
		display: flex;
		justify-content: space-around;
		padding: 30rpx 0;
	}
	
	.index_header_bottom > view {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.index_header_bottom > view text:first-child {
		font-weight:700;
		font-size: 45rpx;
	}
	
	.index_header_bottom > view text:last-child {
		font-size: 30rpx;
		color: #777;
	}
	
	.index_middle {
		display: flex;
		justify-content: space-around;
		margin: 30rpx;
		box-shadow: 0 0 40rpx rgba(0, 0, 0, .1);
		padding: 30rpx 0;
		border-radius: 10rpx;
	}
	
	.index_middle > view {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 20rpx;
		color: #666;
	}
	
	.index_middle > view image {
		width: 60rpx;
		margin-bottom: 10rpx;
	}
	
	.index_my {
		padding: 0 40rpx;
		padding-top: 40rpx;
	}
	
	.index_my_title {
		font-size: 45rpx;
		font-weight: bold;
		padding-bottom: 50rpx;
	}
	.index_my_body {
		
	}
	
	.index_my_body > view {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		font-size: 35rpx;
		font-weight: 500;
	}
	
	.index_my_body > view  image {
		width: 60rpx;
		margin-right: 30rpx;
	}
</style>
