// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken')

const PRIVATE_KET = 'hzau-online'

export function getToken(payload) {
  return jwt.sign(payload, PRIVATE_KET, {
    // 过期时间1h
    expiresIn: 60 * 60 * 24
  })
}

export function verifyToken(token) {
  if (!token) {
    return false;
  } else {
    try {
      let userData = jwt.verify(token, PRIVATE_KET);
      return userData;
    } catch (err) {
      return false;
    }
  }
}
