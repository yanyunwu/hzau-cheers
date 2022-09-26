<template>
	<view class="message_outer">
		<view class="message_title">
			<view style="font-weight: 600;font-size: 100rpx;">留言</view>
			<view>我不畏惧，欢迎光临</view>
		</view>
		<view class="message_list">
				<view class="message_list_item_outer">
					<view class="message_list_item">
						<image src="../../static/girl.png" mode="widthFix"></image>
						<view>
							<text>小助手</text>
							<text>hello world!</text>
						</view>
					</view>
				</view>
				
			<view class="message_list_item_outer" v-for="item in msgList" :key="item.mlid">
				<swipe-action :options="options" @button="onButton($event, item)">
					<view class="message_list_item" @click="openMsg(item)">
						<image src="../../static/girl.png" mode="widthFix"></image>
						<view>
							<text>
								{{item.nickname_for}}
								<text style="font-weight: 500;">({{item.username_for}})</text>
							</text>
							<text>{{item.text}}</text>
						</view>
					</view>
				</swipe-action>
			</view>		
		</view>
		

	</view>
	
</template>

<script>
	import {getLeaveMsg, delLeaveMsg} from '@/api/index.js'
	import swipeAction from '@/components/zhouWei-swipeAction';
	export default {
		components: {
			swipeAction
		},
		data() {
			return {
				msgList: [],
				
			 options:[
				{
					text: '取消',
					style: {
						backgroundColor: '#007aff'
					}
				}, {
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}
			  ]
			}
		},
		methods: {
			getLeaveMsg() {
				getLeaveMsg().then(value => {
					this.msgList = value.data
				}).catch(err => {
					this.msgList = []
				})
			},
			onButton(e, item) {
				if(e.buttonIndex === 1) {
					this.onConfirm(item)
				}
			},
			onConfirm(item) {
				delLeaveMsg(item.mlid).then(value => {
					this.getLeaveMsg()
				}).catch(err => {
					uni.showToast({
						icon:'none',
						title:'删除失败'
					})
				})
				// console.log(item)
			},
			openMsg(item) {
				uni.showModal({
					showCancel:false,
					title:item.nickname_for,
					content:item.text,
					confirmText:'关闭'
				})
			}

		},
		onShow() {
			this.getLeaveMsg()
		},
		onPullDownRefresh() {
			this.getLeaveMsg()
		}
	}
</script>

<style>
	page {
		height: 100vh;
		background-color: #eee;
	}
	
	.message_outer image {
		height: auto;
	}
	
	.message_title {
		padding: 30rpx;
		padding-bottom: 50rpx;
		background-color: white;
	}
	
	.message_list_item_outer {
		display: flex;
		background-color: white;
		margin: 10rpx 20rpx;
		border-radius: 50rpx;
		overflow: hidden;
	}
	
	.message_list_item {
		display: flex;
		align-items: center;
		padding: 0 40rpx;
		padding: 20rpx 50rpx;
	}
	
	.message_list_item  image {
		width: 100rpx;
		flex-basis: 100rpx;
		flex-shrink: 0;
	}
	
	.message_list_item > view {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
		
		white-space: nowrap;
		overflow: hidden;
	}
	
	.message_list_item > view text:first-child {
		font-weight: bold;
		font-size: 35rpx;
	}
	
	.message_list_item > view text:last-child {
		font-size: 30rpx;
		color: #555;
	
	}

</style>
