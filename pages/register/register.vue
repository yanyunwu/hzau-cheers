<template>
	<view class="login_outer">
		<view class="login_avator">
			<image src="../../static/girl.png" mode="widthFix"></image>
		</view>
		<!-- 基础用法，不包含校验规则 -->
		<uni-forms ref="baseForm" :modelValue="form">
			<uni-forms-item label="用户名"  label-width="80px"  required>
				<uni-easyinput v-model="form.username" placeholder="请设置一个你喜欢的用户名" />
			</uni-forms-item>
			<uni-forms-item label="昵称"  label-width="80px"  required>
				<uni-easyinput v-model="form.nickname" placeholder="请设置一个你喜欢的昵称" />
			</uni-forms-item>
			
			<!-- <uni-forms-item label="姓名" label-width="80px">
				<uni-easyinput v-model="form.name" placeholder="请输入姓名" />
			</uni-forms-item> -->
		
			<uni-forms-item label="年龄" required label-width="80px">
				<uni-easyinput v-model="form.age" placeholder="请输入年龄" type="number"/>
			</uni-forms-item>
			<uni-forms-item label="性别" required label-width="80px">
				<uni-data-checkbox v-model="form.sex" :localdata="sexs" />
			</uni-forms-item>

			<uni-forms-item label="确认密码"  label-width="80px" required>
				<uni-easyinput v-model="form.password" placeholder="请输入密码" type="password"/>
			</uni-forms-item>
			<uni-forms-item label="密码"  label-width="80px" required>
				<uni-easyinput v-model="form.confirm" placeholder="请输入确认密码" type="password"/>
			</uni-forms-item>
		</uni-forms>
		<button type="primary" @click="submit">注册</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					name: '',
					age: '',
					sex: 2,
					username: '',
					password: '',
					confirm: '',
					nickname: ''
				},
				
				sexs: [{
					text: '男',
					value: 0
				}, {
					text: '女',
					value: 1
				}, {
					text: '保密',
					value: 2
				}],
			}
		},
		methods: {
			submit() {
				if(!this.verifier()) return
				
				
				this.$request({
					url: '/user/register',
					method: 'post',
					data: {
						username: this.form.username,
						password: this.form.password,
						nickname: this.form.nickname,
						sex:this.form.sex,
						age:Number(this.form.age),
						name:this.form.name
					}
				}).then(value => {
				
					uni.showToast({
						title: '注册成功！快去登录吧',
						duration: 2000,
						complete() {
							uni.redirectTo({
								url:'/pages/login/login'
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
			
			verifier() {
				if(this.form.password !== this.form.confirm){
					uni.showModal({
						title: '提示',
						content: '两次密码输入不一致',
						showCancel: false
					});
					return false
				}
				
				return true
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
