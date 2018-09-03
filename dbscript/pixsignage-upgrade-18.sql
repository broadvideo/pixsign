############################################################
## pre script  #############################################
############################################################

set @version = 19;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-18.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################
	
CREATE TABLE `attendancelog`(
	`attendancelogid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`eventid` int(11) NOT NULL  COMMENT '事件id' , 
	`eventname` varchar(256)  NULL  COMMENT '事件名称' , 
	`personid` int(11) NOT NULL  COMMENT '人员id' , 
	`personname` varchar(256)  NULL  COMMENT '人员名称' , 
	`roomid` int(11) NULL  COMMENT '关联的房间' , 
	`roomname` varchar(256)  NULL  COMMENT '房间名称' , 
	`roomterminalid` int(11) NULL  COMMENT '关联的房间设备id' , 
	`terminalid` varchar(32)  NULL  COMMENT '终端id' , 
	`terminalname` varchar(256)  NULL  COMMENT '终端别名' , 
	`signtype` char(1)  NOT NULL  COMMENT '签到方式：0：刷卡 1：人脸' , 
	`signtime` datetime NOT NULL  COMMENT '签到时间' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`status` char(1)  NULL  COMMENT '状态: 0：无效 1：有效  9：删除' , 
	PRIMARY KEY (`attendancelogid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `event`(
	`eventid` int(11) NOT NULL  auto_increment COMMENT '事件id，自增主键' , 
	`uuid` varchar(32)  NOT NULL  COMMENT '全局唯一标识' , 
	`roomid` int(11) NOT NULL  COMMENT '房间id' , 
	`name` varchar(256)  NULL  COMMENT '事件名称' , 
	`starttime` datetime NOT NULL  COMMENT '开始时间' , 
	`endtime` datetime NULL  COMMENT '结束时间' , 
	`amount` int(11) NULL  COMMENT '关联人员数量' , 
	`sourcetype` char(1)  NOT NULL  COMMENT '数据来源:0:内部 1：外部同步' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NULL  COMMENT '创建人员' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改人员' , 
	`status` char(1)  NOT NULL  COMMENT '状态：0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`eventid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `eventperson`(
	`eventpersonid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`eventid` int(11) NOT NULL  COMMENT '事件id' , 
	`personid` int(11) NOT NULL  COMMENT '人员id' , 
	`signtype` char(1)  NULL  COMMENT '签到方式：0：刷卡 1：人脸' , 
	`signtime` datetime NULL  COMMENT '签到时间' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	PRIMARY KEY (`eventpersonid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

	
CREATE TABLE `person`(
	`personid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`uuid` varchar(32)   NOT NULL  COMMENT '全局唯一标识' , 
	`type` int(11) NOT NULL  COMMENT '类型：0：操作员 1：学生 2：员工 3:vip' , 
	`personno` varchar(128)   NULL  COMMENT '人员编号' , 
	`idcardno` varchar(32)   NULL  COMMENT '身份证号码' , 
	`name` varchar(256)   NULL  COMMENT '姓名' , 
	`sex` char(1)   NULL  COMMENT '性别:-1:未知 0:男  1:女' , 
	`email` varchar(128)   NULL  COMMENT '邮件' , 
	`mobile` varchar(32)   NULL  COMMENT '手机号码' , 
	`address` varchar(1024)   NULL  COMMENT '地址信息' , 
	`avatar` varchar(1024)   NULL  COMMENT '头像地址' , 
	`imageurl` varchar(1024)   NULL  COMMENT '图片地址' , 
	`imagecontent` varchar(4000)   NULL  COMMENT 'base64编码' , 
	`rfid` varchar(256)   NULL  COMMENT 'rfid' , 
	`voiceprompt` varchar(1024)   NULL  COMMENT '识别语音提示' , 
	`orgid` int(11) NOT NULL  , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人员id' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改人员id' , 
	`status` char(1)   NOT NULL  COMMENT '状态：0：无效 1：有效  9：删除' , 
	PRIMARY KEY (`personid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';
	
	

CREATE TABLE `room`(
	`roomid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`uuid` varchar(32)   NULL  COMMENT '全局唯一标识' , 
	`seqno` int(11) NULL  COMMENT '排序asc' , 
	`type` int(11) NOT NULL  COMMENT '0:信发  1:vip 2:考勤 3：会议 4：班牌' , 
	`name` varchar(256)   NOT NULL  COMMENT '名称' , 
	`description` varchar(1024)   NULL  COMMENT '描述信息' , 
	`source_type` char(1)  NULL  DEFAULT '0' COMMENT '数据来源：0：内部录入 1：外部同步' , 
	`orgid` int(11) NOT NULL  COMMENT '所属org' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改人' , 
	`status` char(1)  NOT NULL  COMMENT '状态：0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`roomid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `roomterminal`(
	`roomterminalid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`name` varchar(512)  NOT NULL  COMMENT '名称' , 
	`roomid` int(11) NOT NULL  COMMENT 'roomid' , 
	`terminalid` varchar(32)  NOT NULL  , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	PRIMARY KEY (`roomterminalid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';
	

INSERT INTO `privilege` VALUES ('31101', '2', '311', 'menu.viproom', 'room/room.jsp', NULL, '1', '0', '0', '2018-01-04 18:20:30');
INSERT INTO `privilege` VALUES ('31102', '2', '311', 'menu.viplist', 'person/person.jsp', NULL, '1', '0', '1', '2018-01-05 14:55:52');
INSERT INTO `privilege` VALUES ('311', '2', '0', 'menu.vip', NULL, 'fa-group', '1', '0', '-1', '2018-01-04 18:16:17');
INSERT INTO `privilege` VALUES ('31103', '2', '311', 'menu.vipevent', 'event/vipevent.jsp', NULL, '1', '0', '2', '2018-01-05 19:17:14');
INSERT INTO `privilege` VALUES ('31104', '2', '311', 'menu.vipattendance', 'event/vipattendance.jsp', NULL, '1', '0', '3', '2018-01-08 16:28:00');



############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
