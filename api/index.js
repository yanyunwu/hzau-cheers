import request from '@/utils/request.js'


export function signIn() {
	return request({
		url: '/user/signIn',
		method: 'post'
	})
}

export function getUserInfo() {
	return request({
		url: '/user/getUserInfo',
		method: 'get'
	})
}