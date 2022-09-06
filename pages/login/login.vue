<template>
	<view class="login_outer">
		<view class="login_avator">
			<image src="../../static/boy.png" mode="widthFix"></image>
		</view>
		<!-- 基础用法，不包含校验规则 -->
		<uni-forms ref="baseForm" :modelValue="baseFormData">
			<uni-forms-item label="账号" label-align="center" label-width="50">
				<uni-easyinput v-model="form.username" placeholder="请输入你的账号" />
			</uni-forms-item>
			<uni-forms-item label="密码" label-align="center" label-width="50">
				<uni-easyinput v-model="form.password" placeholder="请输入密码" type="password"/>
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="submit">登录</button>
		<button plain style="border: none;color: blue;" @click="goToRegister">没有账户？去注册</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				}
			}
		},
		methods: {
			submit() {
				this.$request({
					url: '/user/login',
					method: 'post',
					data: {
						username: this.form.username,
						password: this.form.password
					}
				}).then(value => {
					uni.setStorageSync('user-info', value.data)
					
					uni.showToast({
						title: '登录成功，马上跳转',
						duration: 2000,
						complete() {
							uni.switchTab({
								url:'/pages/index/index'
							})
						}
					});
				}).catch(err => {
					uni.showModal({
						title: '提示',
						content: err.info,
						success: function (res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						},
						showCancel: false
					});
				})
			},
			
			goToRegister() {
				uni.navigateTo({
					url:'/pages/register/register'
				})
			}
		}
	}
</script>

<style>
.login_outer {
	padding: 10% 50rpx 0;
}
.login_avator {
	text-align: center;
	padding-bottom: 30rpx;
}

.login_avator  image{
	width: 200rpx;
}
</style>
