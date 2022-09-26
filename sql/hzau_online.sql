/*
 Navicat Premium Data Transfer

 Source Server         : 47.111.23.167
 Source Server Type    : MySQL
 Source Server Version : 50739
 Source Host           : 47.111.23.167:3306
 Source Schema         : hzau_online

 Target Server Type    : MySQL
 Target Server Version : 50739
 File Encoding         : 65001

 Date: 26/09/2022 20:15:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for label
-- ----------------------------
DROP TABLE IF EXISTS `label`;
CREATE TABLE `label`  (
  `lid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '标签内容',
  PRIMARY KEY (`lid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `suid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`suid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `uid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` int(11) UNSIGNED NOT NULL COMMENT '用户唯一标识id',
  `username` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '账号',
  `password` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '密码',
  `nickname` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '昵称',
  `sex` tinyint(1) UNSIGNED NULL DEFAULT 2 COMMENT '用户性别',
  `sno` char(13) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '学号',
  `age` int(5) NULL DEFAULT NULL COMMENT '年龄',
  `state` int(2) UNSIGNED NULL DEFAULT 0 COMMENT '用户状态（0正常1被封禁）',
  `headimage` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '头像',
  `signnature` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '签名',
  `name` varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '真实姓名',
  `good` int(10) UNSIGNED NULL DEFAULT 0 COMMENT '被赞数量',
  `like` int(10) UNSIGNED NULL DEFAULT 0 COMMENT '被喜欢数量',
  `star` int(10) UNSIGNED NULL DEFAULT 10 COMMENT '星星数量',
  `sign_date` varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '签到时间',
  `power` int(3) UNSIGNED NULL DEFAULT 0 COMMENT '权限等级',
  PRIMARY KEY (`uid`, `uuid`) USING BTREE,
  UNIQUE INDEX `uuid`(`uuid`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 104 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_dialogue
-- ----------------------------
DROP TABLE IF EXISTS `user_dialogue`;
CREATE TABLE `user_dialogue`  (
  `did` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户对话表',
  `uid1` int(10) NOT NULL COMMENT '用户1',
  `uid2` int(10) NOT NULL COMMENT '用户2',
  `dstart_time` datetime(0) NULL DEFAULT NULL COMMENT '对话开始时间',
  `dend_time` datetime(0) NULL DEFAULT NULL COMMENT '对话结束时间',
  PRIMARY KEY (`did`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 273 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_dialogue_msg
-- ----------------------------
DROP TABLE IF EXISTS `user_dialogue_msg`;
CREATE TABLE `user_dialogue_msg`  (
  `mid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '单条信息id',
  `did` int(10) UNSIGNED NOT NULL COMMENT '所属对话id',
  `message` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '信息内容',
  `uid` int(10) NOT NULL COMMENT '发送这条信息的人',
  `type` int(2) UNSIGNED NULL DEFAULT 0 COMMENT '消息类型（0聊天，1留言）',
  `mtime` datetime(0) NULL DEFAULT NULL COMMENT '发消息的时间',
  PRIMARY KEY (`mid`) USING BTREE,
  INDEX `msg_did`(`did`) USING BTREE,
  CONSTRAINT `msg_did` FOREIGN KEY (`did`) REFERENCES `user_dialogue` (`did`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 610 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_label
-- ----------------------------
DROP TABLE IF EXISTS `user_label`;
CREATE TABLE `user_label`  (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `uid` int(10) UNSIGNED NOT NULL COMMENT '用户id',
  `lid` int(10) UNSIGNED NOT NULL COMMENT '标签id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `label_lid`(`lid`) USING BTREE,
  INDEX `label_uid`(`uid`) USING BTREE,
  CONSTRAINT `label_lid` FOREIGN KEY (`lid`) REFERENCES `label` (`lid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `label_uid` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 273 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_leave_msg
-- ----------------------------
DROP TABLE IF EXISTS `user_leave_msg`;
CREATE TABLE `user_leave_msg`  (
  `mlid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `did` int(10) UNSIGNED NOT NULL COMMENT '留言的那次对话',
  `uid` int(10) UNSIGNED NOT NULL COMMENT '被留言的人',
  `uid_for` int(10) UNSIGNED NOT NULL COMMENT '留言的人',
  `text` text CHARACTER SET utf8 COLLATE utf8_bin NOT NULL COMMENT '留言内容',
  PRIMARY KEY (`mlid`) USING BTREE,
  INDEX `did`(`did`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE,
  INDEX `uid_for`(`uid_for`) USING BTREE,
  CONSTRAINT `did` FOREIGN KEY (`did`) REFERENCES `user_dialogue` (`did`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uid` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `uid_for` FOREIGN KEY (`uid_for`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_bin ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_report
-- ----------------------------
DROP TABLE IF EXISTS `user_report`;
CREATE TABLE `user_report`  (
  `rid` int(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户举报的表',
  `uid` int(10) UNSIGNED NOT NULL COMMENT '举报者id',
  `did` int(10) NOT NULL COMMENT '举报对话id',
  `uid_be` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '被举报的人',
  `rtime` datetime(0) NULL DEFAULT NULL COMMENT '举报时间',
  `status` int(2) UNSIGNED NOT NULL DEFAULT 0 COMMENT '处理状态（0未处理，1处理完成）',
  `handler_id` int(10) UNSIGNED NULL DEFAULT NULL COMMENT '处理人',
  PRIMARY KEY (`rid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
