<template>
	<view class="container">
		<view class="ui-all">
			<view class="avatar">
				<view  class="imgAvatar">
					<image src="../../static/boy.png" class="iavatar"></image>
				</view>
				<text>{{form.username}}</text>
			</view>
			<view class="ui-list">
				<text>昵称</text>
				<input type="text" placeholder="输入昵称" v-model="form.nickname" placeholder-class="place" />
			</view>
			<view class="ui-list">
				<text>年龄</text>
				<input type="number" placeholder="输入年龄" v-model="form.age"  placeholder-class="place" />
			</view>
			<view class="ui-list right">
				<text>性别</text>
				<picker @change="bindPickerChange" mode='selector' range-key="name" :value="form.sex" :range="sex">
					<view class="picker">
						{{sex[form.sex].name}}
					</view>
				</picker>
			</view>
			
			<view class="ui-list">
				<text>签名</text>
				<textarea placeholder="填写你的个人签名(目前暂不可用)" placeholder-class="place" v-model="form.description"></textarea>
			</view>
			<button class="save" @tap="putInfo">保 存 修 改</button>
		</view>

	</view>
</template>

<script>
	import {getUserInfo, putUserInfo} from '@/api/index.js'
	export default {
	
		data() {
			return {
				sex: [{
					id: 0,
					name: '男'
				}, {
					id: 1,
					name: '女'
				},{
					name: '保密',
					id: 2
				}],
				
				form:{
					age: 0,
					sex: 2,
					nickname: '',
					description:'',
					username: ''
				}

			}

		},
		methods: {
			bindPickerChange(e) {
				this.form.sex = e.detail.value;
			},
			
			getUserInfo() {
				getUserInfo().then(value => {
					this.form = value.data
				})
			},
			putInfo() {
				console.log(this.form)
				putUserInfo({
					age: Number(this.form.age),
					sex: Number(this.form.sex),
					nickname: this.form.nickname
				}).then(value => {
					uni.showToast({
						title:"修改成功！"
					})
				}).catch(err => {
					uni.showToast({
						title:"修改失败"
					})
				})
			}
	
		},
		
		created() {
			this.getUserInfo()
		}

	}
</script>

<style lang="less">
	.container {
		display: block;
	}

	.ui-all {
		padding: 20rpx 40rpx;

		.avatar {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			.imgAvatar {
				width: 140rpx;
				height: 140rpx;
				border-radius: 50%;
				display: inline-block;
				vertical-align: middle;
				overflow: hidden;

				.iavatar {
					width: 100%;
					height: 100%;
					display: block;
				}
			}

			text {
				display: inline-block;
				vertical-align: middle;
				color: #8e8e93;
				font-size: 28rpx;
				margin-left: 40rpx;
			}
		}

		.ui-list {
			width: 100%;
			text-align: left;
			padding: 20rpx 0;
			border-bottom: solid 1px #f2f2f2;
			position: relative;

			text {
				color: #4a4a4a;
				font-size: 28rpx;
				display: inline-block;
				vertical-align: middle;
				min-width: 150rpx;
			}

			input {
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
			}
			button{
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				background: none;
				margin: 0;
				padding: 0;
				&::after{
					display: none;
				}
			}
			picker {
				width: 90%;
				color: #030303;
				font-size: 30rpx;
				display: inline-block;
				vertical-align: middle;
				position: absolute;
				top: 30rpx;
				left: 150rpx;
			}

			textarea {
				color: #030303;
				font-size: 30rpx;
				vertical-align: middle;
				height: 150rpx;
				width: 100%;
				margin-top: 50rpx;
			}

			.place {
				color: #999999;
				font-size: 28rpx;
			}
		}

		.right:after {
			content: ' ';
			width: 20rpx;
			height: 20rpx;
			border-top: solid 1px #030303;
			border-right: solid 1px #030303;
			transform: rotate(45deg);
			-ms-transform: rotate(45deg);
			/* IE 9 */
			-moz-transform: rotate(45deg);
			/* Firefox */
			-webkit-transform: rotate(45deg);
			/* Safari 和 Chrome */
			-o-transform: rotate(45deg);
			position: absolute;
			top: 40rpx;
			right: 0;
		}

		.save {
			background: #030303;
			border: none;
			color: #ffffff;
			margin-top: 40rpx;
			font-size: 28rpx;
		}
	}
</style>
