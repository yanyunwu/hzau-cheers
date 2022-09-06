<template>
	<view>
		<view class="message_title">
			<view style="font-weight: 600;font-size: 100rpx;">消息</view>
			<view>我不畏惧，欢迎光临</view>
		</view>
		<view class="message_list">
			<view class="message_list_item" v-for="i in 5">
				<image src="../../static/girl.png" mode="widthFix"></image>
				<view>
					<text>小明</text>
					<text>hello</text>
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>
	page {
		height: 100vh;
		background-color: #eee;
	}
	
	.message_title {
		padding: 30rpx;
		padding-bottom: 50rpx;
		background-color: white;
	}
	
	.message_list_item {
		display: flex;
		align-items: center;
		padding: 0 40rpx;
		background-color: white;
		margin: 10rpx 20rpx;
		padding: 20rpx 50rpx;
		border-radius: 50rpx;
	}
	
	.message_list_item  image {
		width: 100rpx;
	}
	
	.message_list_item > view {
		display: flex;
		flex-direction: column;
		padding: 0 30rpx;
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
