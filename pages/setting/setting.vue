<template>
	<view class="setting_outer">
		<view class="setting_button" @click="handleLogout">
			<text>退出登录</text>
		</view>
		<view class="setting_button" style="background-color: red;color: white;" @click="handleUncount">
			<text>注销账户</text>
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
			handleLogout() {
				uni.showModal({
					title: '提示',
					content: '你确定要退出登录吗？',
					success: function (res) {
						if (res.confirm) {
							try {
								uni.removeStorageSync('user-info');
							} catch (e) {
								// error
							}
							uni.switchTab({
								url:"/pages/index/index"
							})
						}
					}
				});
			},
			
			handleUncount() {
				uni.showModal({
					title: '提示',
					content: '功能添加中...尽情期待...',
					showCancel: false
				});
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
