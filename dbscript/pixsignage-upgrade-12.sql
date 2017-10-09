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
   branchid int default 0,
   deviceid int not null,
   mediatype char(1) not null,
   mediaid int not null,
   playdate varchar(8),
   total int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (dailyplaylogid)
 )engine = innodb
default character set utf8;
alter table dailyplaylog add index dailyplaylog_index1(deviceid);
alter table dailyplaylog add index dailyplaylog_index2(mediatype, mediaid);
alter table dailyplaylog add index dailyplaylog_index3(orgid);
alter table dailyplaylog add unique index dailyplaylog_index4(deviceid, mediatype, mediaid, playdate);

insert into dailyplaylog(orgid,deviceid,mediatype,mediaid,playdate,total)
select orgid,deviceid,mediatype,mediaid,DATE_FORMAT(starttime,'%Y%m%d'),SUM(total) 
from hourplaylog group by orgid,deviceid,mediatype,mediaid,DATE_FORMAT(starttime,'%Y%m%d');
update dailyplaylog p,device d set p.branchid=d.branchid where p.deviceid=d.deviceid;

create table monthlyplaylog( 
   monthlyplaylogid int not null auto_increment,
   orgid int not null,
   branchid int default 0,
   deviceid int not null,
   mediatype char(1) not null,
   mediaid int not null,
   playmonth varchar(6),
   total int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (monthlyplaylogid)
 )engine = innodb
default character set utf8;
alter table monthlyplaylog add index monthlyplaylog_index1(deviceid);
alter table monthlyplaylog add index monthlyplaylog_index2(mediatype, mediaid);
alter table monthlyplaylog add index monthlyplaylog_index3(orgid);
alter table monthlyplaylog add unique index monthlyplaylog_index4(deviceid, mediatype, mediaid, playmonth);

insert into monthlyplaylog(orgid,deviceid,mediatype,mediaid,playmonth,total)
select orgid,deviceid,mediatype,mediaid,DATE_FORMAT(starttime,'%Y%m'),SUM(total) 
from hourplaylog group by orgid,deviceid,mediatype,mediaid,DATE_FORMAT(starttime,'%Y%m');
update monthlyplaylog p,device d set p.branchid=d.branchid where p.deviceid=d.deviceid;

create table hourflowlog( 
   hourflowlogid int not null auto_increment,
   orgid int not null,
   branchid int default 0,
   deviceid int not null,
   flowdate varchar(8),
   flowhour varchar(10),
   total int default 0,
   male int default 0,
   female int default 0,
   age1 int default 0,
   age2 int default 0,
   age3 int default 0,
   age4 int default 0,
   age5 int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (hourflowlogid)
 )engine = innodb
default character set utf8;
alter table hourflowlog add index hourflowlog_index1(deviceid);
alter table hourflowlog add index hourflowlog_index2(orgid);
alter table hourflowlog add index hourflowlog_index3(deviceid, flowdate);
alter table hourflowlog add unique index hourflowlog_index4(deviceid, flowhour);

alter table templatezone add animationinit varchar(32) default 'none';
alter table templatezone add animationinitdelay int default 0;
alter table templatezone add animationclick varchar(32) default 'none';
alter table templatezone add diyid int default 0;
alter table templatezone add diyactionid int default 0;

alter table pagezone add animationinit varchar(32) default 'none';
alter table pagezone add animationinitdelay int default 0;
alter table pagezone add animationclick varchar(32) default 'none';
alter table pagezone add diyid int default 0;
alter table pagezone add diyactionid int default 0;

alter table vsp add diyflag char(1) default '0';
alter table org add diyflag char(1) default '0';

create table diy( 
   diyid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(64) not null,
   code varchar(32) not null,
   type varchar(32) default '',
   width int default 0,
   height int default 0,
   filepath varchar(64) default '',
   filename varchar(64) default '',
   snapshot varchar(128) default '',
   thumbnail varchar(128) default '',
   version varchar(16) default '',
   status char(1) not null,
   description varchar(1024),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (diyid)
 )engine = innodb
default character set utf8;
alter table diy add unique index diy_index1(code);

create table diyaction( 
   diyactionid int not null auto_increment,
   diyid int not null,
   name varchar(64) default '',
   code varchar(16) default '',
   primary key (diyactionid)
 )engine = innodb
default character set utf8;
alter table diyaction add unique index diyaction_index1(diyid, code);


drop table app;
create table app( 
   appid int not null auto_increment,
   name varchar(64) not null,
   mtype varchar(32) not null,
   sname varchar(64) default '',
   description varchar(512) default '',
   createtime timestamp not null default current_timestamp,
   primary key (appid)
 )engine = innodb
default character set utf8;
alter table app add unique index app_index1(name, mtype);
insert into app(name, sname, mtype) select distinct name, name, mtype from appfile;

update video set format=substring_index(filename, '.', -1);

delete from privilege where privilegeid > 0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.opmanage','','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10101,0,101,'menu.vsp','vsp.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(201,1,0,'menu.org','org.jsp','fa-cloud',1,1);

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


insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(307,2,0,'menu.classcard',NULL,'fa-group','1',0,0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30701,2,307,'menu.classroom','classroom.jsp',NULL,'1',0,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30702,2,307,'menu.schoolclass','schoolclass.jsp',NULL,'1',0,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30703,2,307,'menu.student','student.jsp',NULL,'1',0,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30711,2,307,'menu.courseschedulescheme','courseschedulescheme.jsp',NULL,'1',0,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30712,2,307,'menu.coursescheduleset','courseschedule.jsp',NULL,'1',0,12);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30720,2,307,'menu.attendancescheme','attendancescheme.jsp',NULL,'1',0,20);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30722,2,307,'menu.attendance','attendance.jsp',NULL,'1','0','22');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(3071101,2,30711,'menu.shemetimeconfig','periodtimedtl.jsp',NULL,'2',0,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30731,2,307,'menu.batchimport','classcardimport.jsp',NULL,'1','0',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,orgtype,sequence) values(30741,2,307,'menu.examinationroom','examinationroom.jsp',NULL,'1','0',41);




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
