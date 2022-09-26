<template>
	<view class="index_container">
		<image :src="bg" class="index_bg" ></image>
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
				<view @click="handleMine">
					<image src="../../static/17.png" mode="widthFix"></image>
					<text>账户</text>
				</view>
				<view @click="handleTags">
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
					<view @click="handleAccount"><image src="../../static/2.png" mode="widthFix"></image><text>我的信息</text></view>
					<view @click="handleMessage"><image src="../../static/14.png" mode="widthFix"></image><text>消息中心</text></view>
					<view @click="handleAdmin" v-if="userInfo.power >= 1"><image src="../../static/21.png" mode="widthFix"></image><text>后台管理</text></view>
					<view @click="handleSetting"><image src="../../static/9.png" mode="widthFix" ></image><text>设置中心</text></view>
					<view><image src="../../static/15.png" mode="widthFix" ></image><text>关于我们</text></view>
				</view>
			</view>
			
			<!-- 标签弹窗 -->
			<view>
				<uni-popup ref="popup" type="center">
					<!-- <uni-popup ref="message" type="message">
						<uni-popup-message :type="messageType"  :message="messageText" :duration="messageLong"></uni-popup-message>
					</uni-popup> -->
					<view class="index_tag_popup">
						<text>你当前设置的标签有：</text>
						<view style="padding: 20rpx 0;">
							<uni-data-checkbox mode="button" multiple v-model="checkbox" :localdata="hobby"></uni-data-checkbox>
						</view>
						<view style="display: flex;justify-content: space-around;">
							<button size="mini" @click="$refs.popup.close()">取消</button>
							<button type="primary" size="mini" @click="handleSetTags">保存</button>
						</view>
					</view>
				</uni-popup>
			</view>
		</view>
	</view>
</template>

<script>
	import {signIn, getUserInfo} from '@/api/index.js'
	import {getAllTag, getUserAllTagId, setTags} from '@/api/index.js'
	export default {
		data() {
			return {
				bg: 'https://hzau-online.oss-cn-hangzhou.aliyuncs.com/13.jpg',
				
				isLogin: false,
				
				userInfo: {
					nickname: '登录/注册',
					username: '登录后更加精彩!',
					good:0,
					like:0,
					star:0,
					power: 0
				},
				
				
				checkbox: [],
				hobby: [],
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
					this.getUserInfo()
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
			},
			handleTags(){
				this.getAllTag()
				this.getUserTags()
				this.$refs.popup.open();
			},
			
			handleMine() {
				uni.navigateTo({
					url:'/pages/mine/mine'
				})
			},
			handleAdmin() {
				uni.navigateTo({
					url:"/pages/admin/admin"
				})
			},
			handleAccount() {
				uni.navigateTo({
					url:'/pages/account/account'
				})
			},
			handleMessage() {
				uni.showModal({
					content:'该功能正在开发中...',
					showCancel:false
				})
			},
			
			getUserTags() {
				getUserAllTagId().then(value => {
					this.checkbox = value.data.map(item => item.lid)
				})
			},
			getAllTag() {
				getAllTag().then(value => {
					console.log(value)
					this.hobby = value.data.map(item => ({
						text: item.title,
						value: item.lid
					}))
				})
			},
			handleSetTags(){
				setTags(this.checkbox).then(value => {
					uni.showToast({
						title:'设置成功'
					})
					this.$refs.popup.close()
				}).catch(err => {
					uni.showToast({
						icon:'error',
						title:'设置失败'
					})
				})
			}
		},
	
	}
</script>

<style>
	.index_container image {
		height: auto;
	}
	
	.index_outer {
		background-color: rgba(255, 255, 255, 0.85);
		height: 100vh;
	}
	
	.index_bg {
		position: fixed;
		width: 100%;
		height: 100% !important;
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
	
	.index_tag_popup {
		width:75vw;
		background-color: white;
		padding: 20rpx;
		border-radius: 20rpx;
	}
</style>
