import {getToken} from './token'
import config from '@/config.js'
const baseUrl = config.requestBaseUrl
  
function request (options = {}) {
		
	const token = getToken()
	
    return new Promise((resolve, reject) => {
        uni.request({
            method: options.method || 'get',
            url: baseUrl + options.url,
            data: options.data || {},
            header: {token, ...options.header||{}},
            dataType: options.dataType || 'json',         
        }).then((response) => {
            setTimeout(function() {
                uni.hideLoading();
            }, 200);
            let [error, res] = response;       
			if(res.data.flag) {
				resolve(res.data);
			}else {
				reject(res.data);
			}
        }).catch(error => {
            let [err, res] = error;
			console.log(error)
            reject(err)
        })
    });
}
export default request