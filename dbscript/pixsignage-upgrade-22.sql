############################################################
## pre script  #############################################
############################################################

set @version = 23;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-22.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;

############################################################
## upgrade script ##########################################
############################################################

alter table bundle add exportflag char(1) default 0;
alter table bundle add exportsize bigint default 0;

alter table page add exportflag char(1) default 0;
alter table page add exportsize bigint default 0;

update video set relateid = 0;

alter table org add boardtype varchar(512) default 'Common';
alter table device add boardtype varchar(32) default '';

alter table page add size bigint default 0;
alter table page add md5 varchar(64) default '';
alter table bundle add size bigint default 0;
alter table bundle add md5 varchar(64) default '';

alter table pagezone change touchpageid touchid int default 0;
alter table templatezone change touchtemplateid touchid int default 0;

alter table device add temperatureflag char(1) default '0';
alter table device add relateid int default 0;
alter table org add hightemperature int default 50;
alter table org add lowtemperature int default 40;

ALTER TABLE `meeting` 
	ADD COLUMN `periodmeetingid` int(11)   NOT NULL COMMENT '0:不存在   >0  关联周期会议id' after `uuid`, 
	ADD COLUMN `periodendtime` datetime   NULL COMMENT '周期结束日期 e.g. yyyy-MM-dd' after `endtime`, 
	ADD COLUMN `servicememo` varchar(2048)  COLLATE utf8_general_ci NULL COMMENT '后勤服务备注' after `amount`, 
	ADD COLUMN `periodflag` char(1)  COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '周期会议事件 0：否  1：是' after `qrcode`, 
	ADD COLUMN `skipholidayflag` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期会议是否忽略节假日 0：否  1：是' after `periodflag`, 
	ADD COLUMN `periodtype` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期类型  0：每天 1:工作日 2:每周 3：每个月' after `skipholidayflag`;


ALTER TABLE `person` 
	ADD COLUMN `branchid` int(11)   NULL COMMENT 'branchid' after `voiceprompt`;

UPDATE person p SET branchid=(SELECT branchid FROM branch b WHERE b.orgid=p.orgid  AND parentid=0)  WHERE STATUS='1' AND TYPE='2';

ALTER TABLE `attendancelog` 
	ADD COLUMN `syncstatus` char(1)   NULL DEFAULT '0' COMMENT '同步标识，0:未同步 1：已同步 9：不需要同步' after `createtime`;

insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('205','AttendanceServiceURL','AttendanceServiceURL','',NULL,'1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('206','CourseServiceURL','CourseServiceURL','',NULL,'1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('207','SafeCampusServer','SafeCampusServer','',NULL,'1');

CREATE TABLE `smartbox`(
	`smartboxid` INT(11) NOT NULL  AUTO_INCREMENT , 
	`orgid` INT(11) NOT NULL  , 
	`terminalid` VARCHAR(32)   NOT NULL  COMMENT '终端id' , 
	`qrcodeid` varchar(32) DEFAULT NULL COMMENT '绑定的二维码id',
	`name` VARCHAR(256)   NOT NULL  COMMENT '名称' , 
	`description` VARCHAR(2048)   NULL  , 
	`doorversion` VARCHAR(1)   NOT NULL  COMMENT '1:双柜门  2：新式收货机' , 
	`stocknum` INT(11) NULL  COMMENT '库存数' , 
	`extra` VARCHAR(1024)   NULL  COMMENT '上报额外数据' , 
	`createtime` TIMESTAMP NOT NULL  DEFAULT CURRENT_TIMESTAMP , 
	`status` CHAR(1)   NOT NULL  COMMENT '状态，0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`smartboxid`) 
) ENGINE=INNODB DEFAULT CHARSET='utf8';

CREATE TABLE `smartboxlog`(
	`smartboxlogid` int(11) NOT NULL  auto_increment , 
	`smartboxid` int(11) NULL  , 
	`orgid` int(11) NOT NULL  , 
	`wxuserid` varchar(256)  NOT NULL  , 
	`terminalid` varchar(64)   NOT NULL  , 
	`wxmpid` varchar(256)   NOT NULL  , 
	`doorversion` char(1)   NULL  , 
	`doortype` char(1)   NULL  , 
	`stocknum` int(11) NULL  , 
	`extra` varchar(512)   NULL  , 
	`authorizeopentime` datetime NULL  , 
	`openstate` char(1)   NULL  , 
	`opentime` datetime NULL  , 
	`closestate` char(1)   NULL  , 
	`closetime` datetime NULL  , 
	`createtime` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP , 
	PRIMARY KEY (`smartboxlogid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


delete from privilege where privilegeid > 0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.vsp','vsp.jsp','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(104,0,0,'menu.page','page.jsp','fa-html5',1,4);
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
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30120,2,301,'menu.medialist','resource/medialist.jsp','',1,20);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30130,2,301,'楼盘','resource/house.jsp','',1,30);

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
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30409,2,304,'menu.pagereview','page/page-review.jsp','',1,9);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.schedulemanage','','fa-calendar',1,6);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30500,2,305,'menu.bundleplan','plan/plan-bundle.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','plan/schedule-solo.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30502,2,305,'menu.bundleplan','plan/device-bundle.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30503,2,305,'menu.pageplan','plan/plan-page.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30504,2,305,'menu.pageplan','plan/device-page.jsp','',1,4);

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
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30823,2,308,'menu.viewstat','stat/viewstat.jsp','',1,23);

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

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(310,2,0,'menu.mrbm','','fa-cogs', '1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31001,2,310,'menu.location','meeting/location.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31003,2,310,'menu.equipment','meeting/equipment.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31002,2,310,'menu.meetingroom','meeting/meetingroom.jsp','','1',3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31004,2,310,'menu.meeting','meeting/meeting.jsp','','1',4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31005,2,310,'menu.meetingaudit','meeting/meetingaudit.jsp','','1',5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(311,2,0,'menu.vip','','fa-group','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31101,2,311,'menu.viproom','room/room.jsp','','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31102,2,311,'menu.viplist','person/person.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31103,2,311,'menu.vipevent','event/vipevent.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31104,2,311,'menu.vipattendance','event/vipattendance.jsp','','1',3);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(312,2,0,'menu.staffattendance','','fa-group','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31201,2,312,'menu.room2','room/room2.jsp','','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31202,2,312,'menu.staff2','person/person2.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31203,2,312,'menu.event2','event/event2.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31204,2,312,'menu.personattendance','event/personattendance.jsp','','1',3);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(313,2,0,'menu.smartboxmanage','','fa-group','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31301,2,313,'menu.smartbox','smartbox/smartbox.jsp','','1',1);



############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
