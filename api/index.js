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

export function getUserInfoByUid(uid) {
	return request({
		url: '/admin/getUserInfoByUid/' + uid,
		method: 'get'
	})
}

export function putUserInfo(data) {
	return request({
		url: '/user/putUserInfo',
		method:'post',
		data
	})
}

export function getAllTag() {
	return request({
		url: '/tag/getAllTag'
	})
}

export function getUserAllTagId() {
	return request({
		url:'/user/getAllTagId'
	})
}

export function setTags(list) {
	return request({
		url: '/user/setTags',
		method: 'post',
		data: {
			lidList: list
		}
	})
}

export function getStatus() {
	return request({
		url: '/isProduction'
	})
}

export function addGood(uid) {
	return request({
		url: '/user/addGood/' + uid,
		method: 'post'
	})
}
export function addlike(uid) {
	return request({
		url: '/user/addlike/' + uid,
		method: 'post'
	})
}
export function addStar(uid) {
	return request({
		url: '/user/addStar/' + uid,
		method: 'post'
	})
}

/*
*留言模块
*/


export function leaveMsg(did,uid, text) {
	return request({
		url: '/user/leaveMsg',
		method:'post',
		data : {
			did,uid, text
		}
	})
}

export function getLeaveMsg() {
	return request({
		url: '/user/getLeaveMsg',
	})
}

export function delLeaveMsg(mlid) {
	return request({
		url: '/user/delLeaveMsg/' + mlid,

		method:'post',
	})
}


/*
* 举报模块
*/


export function report(uid, did) {
	return request({
		url: '/user/report',
		method: 'post',
		data: {
			uid,did
		}
	})
}

export function getAllReport() {
	return request({
		url: '/admin/getAllReport'
	})
}


export function getDialogue(did) {
	return request({
		url: '/admin/getDialogue/' + did
	})
}

export function handleReport(rid) {
	return request({
		url:'/admin/handleReport/'+rid,
		method:'post'
	})
}

export function setUserState(uid, state) {
	return request({
		url: '/admin/setUserState',
		method: 'post',
		data: {
			uid, state
		}
	})
}