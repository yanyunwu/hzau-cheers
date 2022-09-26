<template>
	<view class="setting_outer">
		<view class="setting_button" >
			<text>标签管理</text>
		</view>
		<view class="setting_button" @click="handleReport">
			<text>举报管理</text>
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
			handleReport() {
				uni.navigateTo({
					url:"/pages/admin/report/report"
				})
			}
		}
	}
</script>

<style>
	.setting_outer {
		padding: 40rpx;
	}
	
	.setting_button {
		font-size: 30rpx;
		font-weight: 500;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 30rpx;
		box-shadow: 0 0 10px rgba(0, 0, 0, .2);
		padding: 30rpx;
		border-radius: 20rpx;
	}
</style>
