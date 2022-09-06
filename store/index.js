import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
    'hasLogin ':false,//是否登录
    userInfo:{},//用户信息
    networkState:true,//网络状态,
	staticUrl: 'https://online.codexx.cc/api/static/'
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
