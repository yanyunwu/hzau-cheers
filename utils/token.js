

export function getToken() {
	const value = uni.getStorageSync('user-info');
	return (value && value.token) || ''
}

export function getUserInfo() {
	return uni.getStorageSync('user-info');
}