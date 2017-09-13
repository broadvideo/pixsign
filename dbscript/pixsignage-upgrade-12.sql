############################################################
## pre script  #############################################
############################################################

set @version = 13;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-12.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

create table dailyplaylog( 
   dailyplaylogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   deviceid int not null,
   mediatype char(1) not null,
   mediaid int not null,
   playdate date,
   total int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (dailyplaylogid)
 )engine = innodb
default character set utf8;
alter table dailyplaylog add index hourplaylog_index1(deviceid);
alter table dailyplaylog add index hourplaylog_index2(mediatype, mediaid);
alter table dailyplaylog add index hourplaylog_index3(orgid);
alter table dailyplaylog add unique index(deviceid, mediatype, mediaid, playdate);


INSERT INTO `privilege` VALUES ('30720', '2', '307', 'menu.attendancescheme', 'attendancescheme.jsp', NULL, '1', '0', '20', '2017-08-18 15:42:24');

ALTER TABLE `attendance` 
	ADD COLUMN `attendanceeventid` int(11)   NOT NULL COMMENT '考勤事件id' after `studentid`, 
	CHANGE `orgid` `orgid` int(11)   NOT NULL COMMENT 'orgid' after `attendanceeventid`, 
	CHANGE `schoolclassid` `schoolclassid` int(11)   NULL COMMENT '班级id' after `orgid`, 
	CHANGE `classroomid` `classroomid` int(11)   NOT NULL COMMENT '教室id' after `schoolclassid`, 
	CHANGE `coursescheduleid` `coursescheduleid` int(11)   NULL COMMENT '课表id' after `classroomid`, 
	CHANGE `eventtime` `eventtime` datetime   NOT NULL COMMENT '考勤时间' after `coursescheduleid`, 
	CHANGE `createtime` `createtime` datetime   NOT NULL COMMENT '创建时间' after `eventtime`, COMMENT='';

CREATE TABLE `attendanceevent`(
	`attendanceeventid` int(11) NOT NULL  auto_increment COMMENT '自增主键id' , 
	`type` char(1) COLLATE utf8_general_ci NULL  COMMENT '事件所属考勤类型：0：常规 1：基于课表  2：自定义' , 
	`name` varchar(200) COLLATE utf8_general_ci NULL  COMMENT '事件名称' , 
	`attendanceschemeid` int(11) NOT NULL  COMMENT '关联attendancescheme表主键' , 
	`classroomid` int(11) NULL  COMMENT '关联的教室id' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`objectid` int(11) NULL  COMMENT '关联的对象id' , 
	`objecttype` char(1) COLLATE utf8_general_ci NULL  COMMENT '关联对象类型：0：课表id  1：考场 ' , 
	`ondate` varchar(10) COLLATE utf8_general_ci NULL  COMMENT '考勤时间：yyyyMMdd' , 
	`starttime` datetime NULL  COMMENT '事件开始时间' , 
	`endtime` datetime NULL  COMMENT '事件结束时间' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	PRIMARY KEY (`attendanceeventid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `attendancescheme`(
	`attendanceschemeid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`type` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '考勤类型：0：按天考勤 1：按课表考勤  2：自定义考勤' , 
	`name` varchar(200) COLLATE utf8_general_ci NOT NULL  COMMENT '名称' , 
	`amount` int(11) NOT NULL  COMMENT '签到次数' , 
	`timeconfig` varchar(2000) COLLATE utf8_general_ci NOT NULL  , 
	`enableflag` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '模式激活状态：0-未激活  1-激活' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`orgid` int(11) NOT NULL  COMMENT '所属orgid' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人员' , 
	PRIMARY KEY (`attendanceschemeid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
