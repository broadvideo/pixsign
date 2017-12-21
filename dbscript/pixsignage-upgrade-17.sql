############################################################
## pre script  #############################################
############################################################

set @version = 18;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-17.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table device add cataitemid1 int default 0;
alter table device add cataitemid2 int default 0;

create table catalog( 
   catalogid int not null auto_increment,
   orgid int not null,
   type char(1) not null,
   name varchar(128) not null,
   status char(1) default '0',
   primary key (catalogid)
 )engine = innodb
default character set utf8;
alter table catalog add unique(orgid,type);
insert into catalog(orgid, type, name) select orgid, '1', '分类1' from org where status != '9';
insert into catalog(orgid, type, name) select orgid, '2', '分类2' from org where status != '9';

create table cataitem( 
   cataitemid int not null auto_increment,
   catalogid int not null,
   name varchar(128) not null,
   primary key (cataitemid)
 )engine = innodb
default character set utf8;

delete from privilege where privilegeid > 0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.opmanage','','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10101,0,101,'menu.vsp','vsp.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(201,1,0,'menu.sdomain','sdomain.jsp','fa-desktop',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(202,1,0,'menu.org','org.jsp','fa-cloud',1,2);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(300,2,0,'menu.wizard','bundle/wizard.jsp','fa-hand-o-up',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(301,2,0,'menu.resource','','fa-qrcode',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.video','resource/video.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','resource/image.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','resource/audio.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30106,2,301,'menu.text','resource/text.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','resource/stream.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30108,2,301,'menu.dvb','resource/dvb.jsp','',1,8);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30109,2,301,'menu.widget','resource/widget.jsp','',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30110,2,301,'menu.rss','resource/rss.jsp','',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30111,2,301,'menu.diy','resource/diy.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30120,2,301,'menu.medialist','resource/medialist.jsp','',1,20);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30201,2,302,'menu.device','device/device.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30202,2,302,'menu.devicegroup','device/devicegroup.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30204,2,302,'menu.deviceconfig','device/deviceconfig.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30205,2,302,'menu.appfile','device/appfile.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30206,2,302,'menu.deviceversion','device/deviceversion.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30207,2,302,'menu.catalog','device/catalog.jsp','',1,7);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(303,2,0,'menu.bundlemanage','','fa-paw',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30301,2,303,'menu.bundle','bundle/bundle.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30302,2,303,'menu.touchbundle','bundle/bundle-touch.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30305,2,303,'menu.templet','bundle/templet.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30306,2,303,'menu.touchtemplet','bundle/templet-touch.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30309,2,303,'menu.bundlereview','bundle/bundle-review.jsp','',1,9);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(304,2,0,'menu.pagemanage','','fa-html5',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30401,2,304,'menu.page','page/page.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30402,2,304,'menu.touchpage','page/page-touch.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30405,2,304,'menu.template','page/template.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30406,2,304,'menu.touchtemplate','page/template-touch.jsp','',1,6);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.schedulemanage','','fa-calendar',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','plan/schedule-solo.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30502,2,305,'menu.plan','plan/plan-solo.jsp','',1,2);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(306,2,0,'menu.mscreen','','fa-codepen',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30602,2,306,'menu.mediagrid','mscreen/mediagrid.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30603,2,306,'menu.devicegrid','mscreen/devicegrid.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30604,2,306,'menu.devicegridgroup','mscreen/devicegridgroup.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30605,2,306,'menu.multiplan','plan/plan-multi.jsp','',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(308,2,0,'menu.stat','','fa-bar-chart-o',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30801,2,308,'menu.onlinelog','stat/onlinelog.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30802,2,308,'menu.playlog','stat/playlog.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30811,2,308,'menu.oplog','stat/oplog.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30821,2,308,'menu.pflowlog','stat/pflowlog.jsp','',1,21);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30822,2,308,'menu.flowlog','stat/flowlog.jsp','',1,22);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(309,2,0,'menu.systemmanage','','fa-cogs',1,99);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30901,2,309,'menu.staff','system/staff.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30902,2,309,'menu.role','system/role.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30903,2,309,'menu.branch','system/branch.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30909,2,309,'menu.config','system/config.jsp','',1,9);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(307,2,0,'menu.classcard','','fa-group','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30701,2,307,'menu.classroom','classroom.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30702,2,307,'menu.schoolclass','schoolclass.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30703,2,307,'menu.student','student.jsp','','1',3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30711,2,307,'menu.courseschedulescheme','courseschedulescheme.jsp','','1',11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30712,2,307,'menu.coursescheduleset','courseschedule.jsp','','1',12);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30720,2,307,'menu.attendancescheme','attendancescheme.jsp','','1',20);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30722,2,307,'menu.attendance','attendance.jsp','','1','22');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(3071101,2,30711,'menu.shemetimeconfig','periodtimedtl.jsp','','2',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30731,2,307,'menu.batchimport','classcardimport.jsp','','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30741,2,307,'menu.examinationroom','examinationroom.jsp','','1',41);

ALTER TABLE `doorlog` 
	ADD COLUMN `authorizeopentime` datetime   NULL COMMENT '授权开门时间' after `doortype`;

CREATE TABLE `attendee`(
	`attendeeid` int(11) NOT NULL  auto_increment COMMENT '与会人员id，自增主键' , 
	`meetingid` int(11) NOT NULL  COMMENT '会议id' , 
	`staffid` int(11) NOT NULL  COMMENT '人员id' , 
	`signtime` datetime NULL  COMMENT '签到时间' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	PRIMARY KEY (`attendeeid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `equipment`(
	`equipmentid` int(11) NOT NULL  auto_increment COMMENT 'id，自增主键' , 
	`uuid` varchar(32) COLLATE utf8_general_ci NOT NULL  COMMENT '全局唯一标识' , 
	`meetingroomid` int(11) NULL  DEFAULT '-1' COMMENT '所属会议室' , 
	`type` int(11) NOT NULL  COMMENT '类型：投影仪 屏幕 pad' , 
	`code` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '编码' , 
	`name` varchar(256) COLLATE utf8_general_ci NOT NULL  COMMENT '名称' , 
	`ipaddr` varchar(32) COLLATE utf8_general_ci NULL  COMMENT 'ip' , 
	`orgid` int(11) NOT NULL  COMMENT '所属org' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改人' , 
	`status` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '状态：0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`equipmentid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `location`(
	`locationid` int(11) NOT NULL  auto_increment COMMENT '位置id，自增主键' , 
	`uuid` varchar(32) COLLATE utf8_general_ci NOT NULL  COMMENT '全局唯一标识' , 
	`parentid` int(11) NOT NULL  COMMENT '父节点:-1:根节点 ' , 
	`seqno` int(11) NULL  COMMENT '排序ASC' , 
	`level` int(11) NOT NULL  COMMENT '层级：1-n' , 
	`name` varchar(256) COLLATE utf8_general_ci NOT NULL  COMMENT '位置名称' , 
	`code` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '内部编码' , 
	`description` varchar(1024) COLLATE utf8_general_ci NULL  COMMENT '描述信息' , 
	`layout` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '示意图' , 
	`orgid` int(11) NOT NULL  COMMENT '所属org' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改记录的人员id' , 
	`status` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '状态：0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`locationid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

insert into `location`(`locationid`, `uuid`, `parentid`, `seqno`, `level`, `name`, `code`, `description`, `layout`, `orgid`, `createtime`, `createstaffid`, `updatetime`, `updatestaffid`, `status`)
 values ('1', 'f0e81463d4c111e78ff600ac81cbcda7', '-1', '0', '0', '位置', NULL, '位置信息', NULL, '1', '2017-11-29 12:59:04', '-1', NULL, NULL, '1'); 
CREATE TABLE `meeting`(
	`meetingid` int(11) NOT NULL  auto_increment COMMENT '会议id，自增主键' , 
	`uuid` varchar(32) COLLATE utf8_general_ci NOT NULL  COMMENT '全局唯一标识' , 
	`meetingroomid` int(11) NOT NULL  COMMENT '所属会议室id' , 
	`subject` varchar(256) COLLATE utf8_general_ci NOT NULL  COMMENT '会议主题' , 
	`starttime` datetime NOT NULL  COMMENT '会议开始时间' , 
	`endtime` datetime NOT NULL  COMMENT '会议结束时间' , 
	`duration` int(11) NOT NULL  COMMENT '时长，单位秒' , 
	`amount` int(11) NOT NULL  COMMENT '与会人数' , 
	`bookstaffid` int(11) NOT NULL  COMMENT '预定人id' , 
	`bookbranchid` int(11) NULL  COMMENT '预订人所属部门' , 
	`qrcode` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '会议二维码' , 
	`orgid` int(11) NOT NULL  COMMENT '所属org' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改人' , 
	`status` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '状态：0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`meetingid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `meetingroom`(
	`meetingroomid` int(11) NOT NULL  auto_increment COMMENT '会议室id，自增主键' , 
	`uuid` varchar(32) COLLATE utf8_general_ci NOT NULL  COMMENT '全局唯一标识' , 
	`terminalid` varchar(64) COLLATE utf8_general_ci NULL  COMMENT '绑定终端id' , 
	`code` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '会议室内部编码' , 
	`name` varchar(256) COLLATE utf8_general_ci NOT NULL  COMMENT '名称' , 
	`description` varchar(1024) COLLATE utf8_general_ci NULL  COMMENT '描述信息' , 
	`locationid` int(11) NULL  COMMENT '位置id' , 
	`layout` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '房间示意图' , 
	`peoples` int(11) NOT NULL  COMMENT '允许容纳人数' , 
	`openflag` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '是否接受预定：0-否 1-是' , 
	`qrcode` varchar(256) COLLATE utf8_general_ci NULL  COMMENT '会议二维码' , 
	`orgid` int(11) NOT NULL  , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatestaffid` int(11) NULL  COMMENT '修改人' , 
	`status` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '状态：0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`meetingroomid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


INSERT INTO `privilege` VALUES ('31005', '2', '310', 'menu.meetingaudit', 'meeting/meetingaudit.jsp', NULL, '1', '0', '5', '2017-11-28 17:00:33');
INSERT INTO `privilege` VALUES ('31004', '2', '310', 'menu.meeting', 'meeting/meeting.jsp', NULL, '1', '0', '4', '2017-11-28 17:00:33');
INSERT INTO `privilege` VALUES ('31002', '2', '310', 'menu.meetingroom', 'meeting/meetingroom.jsp', NULL, '1', '0', '3', '2017-11-28 16:58:12');
INSERT INTO `privilege` VALUES ('31001', '2', '310', 'menu.location', 'meeting/location.jsp', NULL, '1', '0', '1', '2017-11-28 16:57:40');
INSERT INTO `privilege` VALUES ('31003', '2', '310', 'menu.equipment', 'meeting/equipment.jsp', NULL, '1', '0', '2', '2017-11-28 16:59:43');
INSERT INTO `privilege` VALUES ('310', '2', '0', 'menu.mrbm', NULL, 'fa-cogs', '1', '0', '-1', '2017-11-28 16:54:14');


ALTER TABLE `meeting` 
	ADD COLUMN `description` varchar(2048)  COLLATE utf8_general_ci NULL COMMENT '会议描述信息' after `subject`, 
	ADD COLUMN `auditstatus` char(1)  COLLATE utf8_general_ci NULL COMMENT '审核状态： 0：待审核  1：通过 2：拒绝' after `updatestaffid`;

ALTER TABLE `meetingroom` 
	ADD COLUMN `auditflag` char(1)  COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '预定是否需要审核: 0:否 1:是' after `openflag`;

ALTER TABLE `branch` 
	ADD COLUMN `uuid` varchar(32)  COLLATE utf8_general_ci NULL COMMENT '全局唯一标识' after `branchid`; 
ALTER TABLE `doorlog` 
	ADD COLUMN `authorizeopentime` datetime   NULL COMMENT '授权开门时间' after `doortype`;
ALTER TABLE `staff` 
	ADD COLUMN `uuid` varchar(32)  COLLATE utf8_general_ci NULL COMMENT '全局唯一标识' after `staffid`, 
	ADD COLUMN `email` varchar(128)  COLLATE utf8_general_ci NULL COMMENT '邮箱' after `name`;
############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
