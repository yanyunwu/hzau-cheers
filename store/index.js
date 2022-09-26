import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const staticSecret = '?Expires=1662538435&OSSAccessKeyId=TMP.3KiLv38M53CVcdCRqG7n6TTNDMxDKQiryuqyfb5AV3KyrA1953pgKtZovGE4MobYENyN25bHXuR7UWMfTzFTKGu6vxd3RL&Signature=0qx7HtBz9LzuKGk9qeWs0iN7pKI%3D'
const store = new Vuex.Store({
    state: {
    'hasLogin ':false,//是否登录
    userInfo:{},//用户信息
    networkState:true,//网络状态,
	staticUrl: 'https://online.codexx.cc/api/static/',
	images: {
		matchBg: 'https://hzau-online.oss-cn-hangzhou.aliyuncs.com/12.jpg'
	}
    },
    mutations: {
    //监听网络状态变化
		changeWorksState(state){
			uni.getNetworkType({
			    success: function (res) {
			        if (res.networkType === "none") {
			        	//无连接
			        	state.networkState=false;
			        } else {
			        	state.networkState=true;
			        }
			    }
			});
		},
	},
    actions: {
		
	}
})
export default store
