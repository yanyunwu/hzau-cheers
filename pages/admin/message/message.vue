<template>
	<view>
		<uni-list>
		 	<uni-list-item 
				v-for="item in list"
				:title="'发送人：' + sender(item)" 
				:rightText="'时间：' + time(item.mtime)" 
				thumb-size="lg" 
				:note="'内容：' + item.message" 
				clickable  
				:key="item.mid"
			>
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	import {getDialogue} from '@/api/index.js'
	export default {
		data() {
			return {
				list: [],
				did: null,
				user: {},
				user_be: {}
			}
		},
		methods: {
			getDialogue() {
				getDialogue(this.did).then(value => {
					this.list = value.data
					console.log(value.data)
				}) 
			},
			
			time(time) {
				return new Date(time).toLocaleString()
			},
			
			sender(item) {
				if(item.uid === this.user.uid) return this.senderString(this.user)
				if(item.uid === this.user_be.uid) return this.senderString(this.user_be)
			},
			
			senderString(user) {
				return `${user.nickname}(${user.username})`
			}
		},
		onLoad(option) {
			let data = JSON.parse(decodeURIComponent(option.data))
			this.did = data.did
			this.user = data.user
			this.user_be = data.user_be
			
			this.getDialogue()
			
		}
	}
</script>

<style>

</style>
