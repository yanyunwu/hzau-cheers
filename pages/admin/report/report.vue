<template>
	<view>
		 <uni-list>
		 	<uni-list-item 
				v-for="item in list"
				:title="'举报人：' + item.nickname + '(' + item.username + ')'" 
				:note="'举报时间：' + time(item.rtime)" 
				thumb-size="lg" 
				:rightText="status(item.status)" 
				clickable  
				@click="onClick(item)"
				:key="item.rid"
			>
			</uni-list-item>
		</uni-list>
		
		<view>
			<uni-popup ref="popup" type="center">
				<view class="report_popup">
					<view class="">
						举报人：{{curItem.nickname}}({{curItem.username}})
					</view>
					<view class="">
						被举报人：{{user_be.nickname}}({{user_be.username}})
					</view>
					<view class="">
						举报时间：{{time(curItem.rtime)}}
					</view>
					<view style="display: flex;align-items: center;margin: 10rpx 0;">
						<button size="mini" @click="handleSelectMsg">查看对话记录</button>
					</view>
					<view class="">
						<uni-forms-item label="操作：">
							<uni-data-checkbox v-model="value" :localdata="range" />
						</uni-forms-item>
					</view>
					<view style="display: flex;justify-content: space-around;">
						<button size="mini" @click="$refs.popup.close()">取消</button>
						<button type="primary" size="mini" @click="handleSumbit">完成处理</button>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import {getAllReport,getUserInfoByUid, setUserState, handleReport} from '@/api/index.js'
	export default {
		data() {
			return {
				list: [],
				curItem: {
					
				},
				user_be: {
					
				},
				range: [
				  { value: 0, text: "不操作" },
				  { value: 1, text: "封禁账户" },
				],
				
				value: 0,
			}
		},
		methods: {
			onClick(e) {
				this.curItem = e
				getUserInfoByUid(e.uid_be).then(value => {
					this.user_be = value.data
					this.$refs.popup.open()
				})
				
			},
			
			getAllReport() {
				getAllReport().then(value => {
					this.list = value.data
					console.log(value.data)
				})
			},
			
			time(time) {
				return new Date(time).toLocaleString()
			},
			
			status(num) {
				return num ? '已处理' : '未处理'
			},
			
			async handleSumbit() {
				try{
					
					await setUserState(this.curItem.uid_be, this.value)
					
					await handleReport(this.curItem.rid)
					uni.showToast({
						title:"处理成功"
					})
					this.$refs.popup.close()
				}catch(e){
					uni.showToast({
						icon:'none',
						title:"处理失败"
					})
				}
			},
			
			handleSelectMsg() {
				let user = {
					uid: this.curItem.uid,
					username: this.curItem.username,
					nickname: this.curItem.nickname
				}
				
				let user_be = {
					uid: this.curItem.uid_be,
					username: this.user_be.username,
					nickname: this.user_be.nickname
				}
				
				let data = {
					user,user_be,did: this.curItem.did
				}
				uni.navigateTo({
					url:`/pages/admin/message/message?data=${encodeURIComponent(JSON.stringify(data))}`
				})
			}
		},
		created() {
			this.getAllReport()
		}
	}
</script>

<style>
.report_popup {
	width:75vw;
	background-color: white;
	padding: 20rpx;
	border-radius: 20rpx;
}

.uni-forms-item {
	align-items: center;
}
</style>
