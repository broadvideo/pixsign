############################################################
## pre script  #############################################
############################################################

set @version = 10;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-9.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

drop table pagezone;
drop table page;
drop table layoutschedule;
drop table regionschedule;
drop table layoutdtl;
drop table layout;
drop table pagepkg;
drop table gridscheduledtl;
drop table gridschedule;
drop table region;

alter table vsp add bundleflag char(1) default '1';
alter table vsp add pageflag char(1) default '0';

alter table org add bundleflag char(1) default '1';
alter table org add pageflag char(1) default '0';

create table template( 
   templateid int not null auto_increment,
   uuid varchar(64) not null,
   orgid int not null,
   name varchar(64) not null,
   snapshot varchar(128),
   ratio char(1) default '1',
   height int not null,
   width int not null,
   touchflag char(1) default '0',
   homeflag char(1) default '1',
   hometemplateid int,
   homeidletime int default 0,
   publicflag char(1) default '0',
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (templateid)
 )engine = innodb
default character set utf8;

create table templatezone( 
   templatezoneid int not null auto_increment,
   templateid int not null,
   hometemplateid int,
   type tinyint not null,
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   transform varchar(128),
   bdcolor varchar(32) default '#000000',
   bdstyle varchar(128) default 'solid',
   bdwidth int default 0,
   bdradius int default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   opacity int default 0,
   padding int default 0,
   shadowh int default 0,
   shadowv int default 0,
   shadowblur int default 0,
   shadowcolor varchar(8) default '#000000',
   color varchar(32) default '#000000',
   fontfamily varchar(32),
   fontsize int default 0,
   fontweight varchar(32),
   fontstyle varchar(32),
   decoration varchar(32),
   align varchar(32),
   lineheight int default 0,
   dateformat varchar(32) default '',
   touchtype char(1) default 0,
   touchtemplateid int default 0,
   content longtext,
   primary key (templatezoneid),
   foreign key (templateid) references template(templateid)
 )engine = innodb
default character set utf8;

create table templatezonedtl( 
   templatezonedtlid int not null auto_increment,
   templatezoneid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   primary key (templatezonedtlid),
   foreign key (templatezoneid) references templatezone(templatezoneid)
 )engine = innodb
default character set utf8;

create table page( 
   pageid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   templateid int default 0,
   name varchar(64) not null,
   snapshot varchar(128),
   ratio char(1) default '1',
   height int not null,
   width int not null,
   touchflag char(1) default '0',
   homeflag char(1) default '1',
   homepageid int,
   homeidletime int default 0,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   updatetime datetime,
   createstaffid int,
   primary key (pageid)
 )engine = innodb
default character set utf8;

create table pagezone( 
   pagezoneid int not null auto_increment,
   pageid int not null,
   homepageid int,
   type tinyint not null,
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   transform varchar(128),
   bdcolor varchar(32) default '#000000',
   bdstyle varchar(128) default 'solid',
   bdwidth int default 0,
   bdradius int default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   opacity int default 0,
   padding int default 0,
   shadowh int default 0,
   shadowv int default 0,
   shadowblur int default 0,
   shadowcolor varchar(8) default '#000000',
   color varchar(32) default '#000000',
   fontfamily varchar(32),
   fontsize int default 0,
   fontweight varchar(32),
   fontstyle varchar(32),
   decoration varchar(32),
   align varchar(32),
   lineheight int default 0,
   dateformat varchar(32) default '',
   touchtype char(1) default 0,
   touchpageid int default 0,
   content longtext,
   primary key (pagezoneid),
   foreign key (pageid) references page(pageid)
 )engine = innodb
default character set utf8;

create table pagezonedtl( 
   pagezonedtlid int not null auto_increment,
   pagezoneid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   primary key (pagezonedtlid),
   foreign key (pagezoneid) references pagezone(pagezoneid)
 )engine = innodb
default character set utf8;

alter table video add format varchar(16) default '';
update video set format=substring_index(filename, '.', -1);

delete from privilege where privilegeid > 0;

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.opmanage','','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10101,0,101,'menu.vsp','vsp.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(201,1,0,'menu.org','org.jsp','fa-cloud',1,1);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(300,2,0,'menu.wizard','wizard.jsp','fa-hand-o-up',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(301,2,0,'menu.resource','','fa-qrcode',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.video','video.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','image.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','audio.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30106,2,301,'menu.text','text.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','stream.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30108,2,301,'menu.dvb','dvb.jsp','',1,8);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30109,2,301,'menu.widget','widget.jsp','',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30110,2,301,'menu.rss','rss.jsp','',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30120,2,301,'menu.medialist','medialist.jsp','',1,20);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30201,2,302,'menu.device','device.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30202,2,302,'menu.devicegroup','devicegroup.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30204,2,302,'menu.deviceconfig','deviceconfig.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30205,2,302,'menu.appfile','appfile.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30206,2,302,'menu.deviceversion','deviceversion.jsp','',1,6);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(303,2,0,'menu.bundlemanage','','fa-paw',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30301,2,303,'menu.bundle','bundle.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30302,2,303,'menu.touchbundle','bundle-touch.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30305,2,303,'menu.templet','templet.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30306,2,303,'menu.touchtemplet','templet-touch.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30309,2,303,'menu.bundlereview','bundle-review.jsp','',1,9);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(304,2,0,'menu.pagemanage','','fa-html5',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30401,2,304,'menu.page','page.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30402,2,304,'menu.touchpage','page-touch.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30405,2,304,'menu.template','template.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30406,2,304,'menu.touchtemplate','template-touch.jsp','',1,6);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.schedulemanage','','fa-calendar',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','schedule-solo.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30502,2,305,'menu.plan','plan-solo.jsp','',1,2);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(306,2,0,'menu.mscreen','','fa-codepen',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30602,2,306,'menu.mediagrid','mediagrid.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30603,2,306,'menu.devicegrid','devicegrid.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30604,2,306,'menu.devicegridgroup','devicegridgroup.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30605,2,306,'menu.multiplan','plan-multi.jsp','',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(308,2,0,'menu.stat','','fa-bar-chart-o',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30801,2,308,'menu.onlinelog','onlinelog.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30802,2,308,'menu.playlog','playlog.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30811,2,308,'menu.oplog','oplog.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30821,2,308,'menu.pflowlog','pflowlog.jsp','',1,21);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30822,2,308,'menu.flowlog','flowlog.jsp','',1,22);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(309,2,0,'menu.systemmanage','','fa-cogs',1,99);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30901,2,309,'menu.staff','staff.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30902,2,309,'menu.role','role.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30903,2,309,'menu.branch','branch.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30909,2,309,'menu.config','config.jsp','',1,9);


insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(307,2,0,'menu.classcard',NULL,'fa-group','1',0,0);
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(30701,2,307,'menu.classroom','classroom.jsp',NULL,'1',0,1);
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(30702,2,307,'menu.schoolclass','schoolclass.jsp',NULL,'1',0,2);
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(30703,2,307,'menu.student','student.jsp',NULL,'1',0,3);
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(30711,2,307,'menu.courseschedulescheme','courseschedulescheme.jsp',NULL,'1',0,11);
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(30712,2,307,'menu.coursescheduleset','courseschedule.jsp',NULL,'1',0,12);
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(30722,2,307,'menu.attendance','attendance.jsp',NULL,'1','0','22');
insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(3071101,2,30711,'menu.shemetimeconfig','periodtimedtl.jsp',NULL,'2',0,1);



/* Create table in target */
CREATE TABLE `classroom`(
	`classroomid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`seqno` int(11) NOT NULL  COMMENT '排序，自增ASC规则排序' , 
	`uuid` varchar(32) COLLATE utf8_general_ci NOT NULL  COMMENT '全局uuid' , 
	`name` varchar(500) COLLATE utf8_general_ci NOT NULL  COMMENT '教室名称' , 
	`description` varchar(1000) COLLATE utf8_general_ci NULL  COMMENT '教室说明信息' , 
	`sourcetype` char(1) COLLATE utf8_general_ci NOT NULL  DEFAULT '0' COMMENT '数据来源：0：内部录入 1：外部导入' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createpsnid` int(11) NOT NULL  COMMENT '创建人员id' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatepsnid` int(11) NULL  COMMENT '修改人员id' , 
	PRIMARY KEY (`classroomid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `courseschedule`(
	`coursescheduleid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`courseid` int(11) NULL  COMMENT '课程id' , 
	`coursename` varchar(500) COLLATE utf8_general_ci NOT NULL  COMMENT '课程名称' , 
	`classroomid` int(11) NOT NULL  COMMENT '教室id' , 
	`classroomname` varchar(500) COLLATE utf8_general_ci NOT NULL  COMMENT '教室名称' , 
	`teacherid` int(11) NULL  COMMENT '老师id' , 
	`teachername` varchar(500) COLLATE utf8_general_ci NOT NULL  COMMENT '老师姓名' , 
	`coursescheduleschemeid` int(11) NOT NULL  COMMENT 'Ref:课表方案配置id' , 
	`workday` int(11) NULL  COMMENT '工作日：1-7' , 
	`periodtimedtlid` int(11) NULL  COMMENT 'Ref;period_time_dtl.id' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgId' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createpsnid` int(11) NOT NULL  COMMENT '创建人员id' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatepsnid` int(11) NULL  COMMENT '修改人员id' , 
	PRIMARY KEY (`coursescheduleid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `courseschedulescheme`(
	`coursescheduleschemeid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`name` varchar(500) COLLATE utf8_general_ci NULL  COMMENT '课表方案名称' , 
	`description` varchar(1000) COLLATE utf8_general_ci NULL  COMMENT '备注信息' , 
	`workdays` varchar(500) COLLATE utf8_general_ci NOT NULL  COMMENT '以逗号分隔形式存储:1,2,3,4,5  1:代表星期一' , 
	`morningperiods` int(11) NOT NULL  COMMENT '上午节数' , 
	`afternoonperiods` int(11) NOT NULL  COMMENT '下午节数' , 
	`nightperiods` int(11) NOT NULL  COMMENT '晚上节数' , 
	`periodduration` int(11) NULL  COMMENT '上课时长（秒）' , 
	`enableflag` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '标记是否启用：0:禁用 1:启用' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createpsnid` int(11) NOT NULL  COMMENT '创建人员id' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatepsnid` int(11) NULL  COMMENT '修改人员id' , 
	PRIMARY KEY (`coursescheduleschemeid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `periodtimedtl`(
	`periodtimedtlid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`type` char(1) COLLATE utf8_general_ci NOT NULL  COMMENT '类型：0-上午 1：中午 2：下午 3：晚上' , 
	`periodnum` int(11) NOT NULL  COMMENT '第几节：1-n' , 
	`periodname` varchar(100) COLLATE utf8_general_ci NOT NULL  COMMENT '节数别名' , 
	`shortstarttime` varchar(50) COLLATE utf8_general_ci NULL  COMMENT '上课开始时间，格式：HH:mm:ss' , 
	`shortendtime` varchar(50) COLLATE utf8_general_ci NULL  COMMENT '上课结束时间，格式：HH:mm:ss' , 
	`duration` int(11) NOT NULL  COMMENT '上课时长：e.g. seconds' , 
	`coursescheduleschemeid` int(11) NOT NULL  COMMENT '课表方案id' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createpsnid` int(11) NOT NULL  COMMENT '创建人员id' , 
	`updatetime` datetime NULL  COMMENT '修改时间' , 
	`updatepsnid` int(11) NULL  COMMENT '修改人员id' , 
	PRIMARY KEY (`periodtimedtlid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


CREATE TABLE `schoolclass`(
	`schoolclassid` int(11) NOT NULL  auto_increment COMMENT '班级id' , 
	`orgid` int(11) NOT NULL  COMMENT '所属org' , 
	`classroomid` int(11) NULL  COMMENT '关联教室' , 
	`name` varchar(100) COLLATE utf8_general_ci NOT NULL  COMMENT '班级名称' , 
	`description` varchar(500) COLLATE utf8_general_ci NULL  COMMENT '说明信息' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	PRIMARY KEY (`schoolclassid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `student`(
	`studentid` int(11) NOT NULL  auto_increment COMMENT '学生id' , 
	`orgid` int(11) NULL  COMMENT '学校id' , 
	`schoolclassid` int(11) NULL  COMMENT '班级id' , 
	`studentno` varchar(200) COLLATE utf8_general_ci NOT NULL  COMMENT '学号' , 
	`name` varchar(200) COLLATE utf8_general_ci NOT NULL  COMMENT '姓名' , 
	`hardid` varchar(200) COLLATE utf8_general_ci NOT NULL  COMMENT '硬件id' , 
	`avatar` varchar(200) COLLATE utf8_general_ci NULL  COMMENT '头像地址' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建操作员id' , 
	PRIMARY KEY (`studentid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

CREATE TABLE `attendance`(
	`attendanceid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`studentid` int(11) NOT NULL  COMMENT '学生id' , 
	`orgid` int(11) NOT NULL  COMMENT 'orgid' , 
	`schoolclassid` int(11) NULL  COMMENT '班级id' , 
	`classroomid` int(11) NOT NULL  COMMENT '教室id' , 
	`coursescheduleid` int(11) NULL  COMMENT '课表id' , 
	`eventtime` datetime NOT NULL  COMMENT '考勤时间' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	PRIMARY KEY (`attendanceid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
