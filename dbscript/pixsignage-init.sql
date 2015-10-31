############################################################
## pre script  #############################################
############################################################

set @version = 1;
set @module = 'pixsignage';
set @dbscript=concat(@module,'-init.sql');

create table dbversion( 
   dbversionid int not null auto_increment,
   version int not null,
   dbscript varchar(64) not null,
   type char(1),
   status char(1) default '0',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   primary key (dbversionid)
 )engine = innodb
default character set utf8;

insert into dbversion(version,dbscript,type,status) values(0,'','0','1');
insert into dbversion(version,dbscript,type,status) values(@version,@dbscript,'1','0');
select last_insert_id() into @dbversionid;


############################################################
## create table ############################################
############################################################

create table config( 
   configid int not null,
   code varchar(32) not null,
   name varchar(64) not null,
   value varchar(1024),
   refer varchar(1024),
   type char(1),
   primary key (configid)
 )engine = innodb
default character set utf8;

create table vsp( 
   vspid int not null auto_increment,
   name varchar(64) not null,
   code varchar(16) not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (vspid)
 )engine = innodb
default character set utf8;
 
create table org( 
   orgid int not null auto_increment,
   vspid int not null,
   name varchar(64) not null,
   code varchar(16) not null,
   status char(1) default '1',
   orgtype char(1) default '1',
   videoflag char(1) default '1',
   imageflag char(1) default '1',
   textflag char(1) default '1',
   streamflag char(1) default '1',
   dvbflag char(1) default '1',
   widgetflag char(1) default '1',
   expireflag char(1) default '0',
   expiretime datetime,
   maxdevices int,
   maxstorage bigint,
   currentdevices int,
   currentstorage bigint,
   currentdeviceidx int,
   copyright varchar(512),
   description varchar(512),
   backupvideoid int,
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (orgid),
   foreign key (vspid) references vsp(vspid)
 )engine = innodb
default character set utf8;
 
create table branch( 
   branchid int not null auto_increment,
   orgid int not null,
   parentid int,
   name varchar(64) not null,
   code varchar(16) not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (branchid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;
 
create table staff( 
   staffid int not null auto_increment,
   subsystem char(1) default '1',
   vspid int,
   orgid int,
   branchid int,
   loginname varchar(32) not null,
   password varchar(128),
   name varchar(64) not null,
   status char(1) default '1',
   token varchar(128),
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   loginflag char(1) default '0',
   logintime datetime,
   primary key (staffid)
 )engine = innodb
default character set utf8;
 
create table role( 
   roleid int not null auto_increment,
   subsystem char(1) default '1',
   vspid int,
   orgid int,
   name varchar(64) not null,
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (roleid)
 )engine = innodb
default character set utf8;
 
create table privilege( 
   privilegeid int not null,
   subsystem char(1),
   parentid int,
   name varchar(64),
   menuurl varchar(512),
   icon varchar(32),
   type char(1) default '1',
   orgtype varchar(10) default '0',
   sequence int,
   createtime timestamp not null default current_timestamp,
   primary key (privilegeid)
 )engine = innodb
default character set utf8;

create table staffrole( 
   staffid int not null,
   roleid int not null,
   foreign key (staffid) references staff(staffid),
   foreign key (roleid) references role(roleid)
 )engine = innodb
default character set utf8;
alter table staffrole add unique(staffid,roleid);

create table staffprivilege( 
   staffid int not null,
   privilegeid int not null,
   foreign key (staffid) references staff(staffid) 
 )engine = innodb
default character set utf8;
alter table staffprivilege add unique(staffid,privilegeid);

create table roleprivilege( 
   roleid int not null,
   privilegeid int not null,
   foreign key (roleid) references role(roleid) 
 )engine = innodb
default character set utf8;
alter table roleprivilege add unique(roleid,privilegeid);


create table image( 
   imageid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(256) not null,
   filename varchar(256) not null,
   size bigint,
   md5 varchar(64),
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (imageid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table video( 
   videoid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(256) not null,
   type char(1) default '1',
   filename varchar(256) not null,
   size bigint,
   md5 varchar(64),
   status char(1) default '1',
   progress int,
   description varchar(1024),
   thumbnail varchar(128),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (videoid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table text( 
   textid int not null auto_increment,
   orgid int not null,
   name varchar(256) not null,
   text longtext not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (textid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table stream( 
   streamid int not null auto_increment,
   orgid int not null,
   name varchar(256) not null,
   url varchar(1024) not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (streamid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table dvb( 
   dvbid int not null auto_increment,
   orgid int not null,
   name varchar(256) not null,
   frequency varchar(32) not null,
   number varchar(16) not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (dvbid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table widget( 
   widgetid int not null auto_increment,
   orgid int not null,
   name varchar(256) not null,
   url varchar(1024) not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (widgetid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table medialist( 
   medialistid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(256) not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (medialistid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table medialistdtl( 
   medialistdtlid int not null auto_increment,
   medialistid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   primary key (medialistdtlid)
 )engine = innodb
default character set utf8;

create table device( 
   deviceid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   terminalid varchar(64) not null,
   hardkey varchar(64),
   name varchar(64),
   position varchar(512),
   ip varchar(32),
   mac varchar(32),
   schedulestatus char(1) default '0',
   filestatus char(1) default '0',
   status char(1) default '0',
   description varchar(512),
   onlineflag char(1) default '0',
   version varchar(32),
   type char(1) default '1',
   devicegroupid int default 0,
   createtime timestamp not null default current_timestamp,
   activetime datetime,
   refreshtime datetime,
   primary key (deviceid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table devicegroup( 
   devicegroupid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(64) not null,
   code varchar(32) not null,
   status char(1),
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (devicegroupid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table region( 
   regionid int not null,
   name varchar(64) not null,
   code varchar(32) not null,
   type char(1) default '0',
   primary key (regionid)
 )engine = innodb
default character set utf8;

create table layout( 
   layoutid int not null auto_increment,
   orgid int not null,
   name varchar(64) not null,
   type char(1) default '0',
   status char(1) default '1',
   ratio char(1) default '1',
   height int,
   width int,
   bgcolor varchar(8),
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (layoutid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table layoutdtl( 
   layoutdtlid int not null auto_increment,
   layoutid int not null,
   regionid int not null,
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null,
   intervaltime int,
   direction char(1),
   speed char(1),
   color varchar(8),
   size int,
   opacity int,
   createtime timestamp not null default current_timestamp,
   primary key (layoutdtlid),
   foreign key (layoutid) references layout(layoutid),
   foreign key (regionid) references region(regionid)
 )engine = innodb
default character set utf8;

create table task( 
   taskid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(64) not null,
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (taskid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table layoutschedule( 
   layoutscheduleid int not null auto_increment,
   bindtype char(1) not null,
   bindid int not null,
   layoutid int not null,
   playmode char(1) not null,
   playdate date,
   starttime time,
   endtime time,
   createtime timestamp not null default current_timestamp,
   primary key (layoutscheduleid),
   foreign key (layoutid) references layout(layoutid)
 )engine = innodb
default character set utf8;

create table regionschedule( 
   regionscheduleid int not null auto_increment,
   bindtype char(1) not null,
   bindid int not null,
   regionid int not null,
   playmode char(1) not null,
   playdate date,
   starttime time,
   endtime time,
   objtype char(1) not null,
   objid int not null,
   taskid int,
   createtime timestamp not null default current_timestamp,
   primary key (regionscheduleid),
   foreign key (regionid) references region(regionid)
 )engine = innodb
default character set utf8;

create table devicefile( 
   devicefileid int not null auto_increment,
   deviceid int not null,
   taskid int,
   objtype char(1) not null,
   objid int not null,
   size bigint,
   progress int,
   status char(1),
   description varchar(1024),
   createtime timestamp not null default current_timestamp,
   updatetime datetime,
   primary key (devicefileid),
   foreign key (deviceid) references device(deviceid)
 )engine = innodb
default character set utf8;

create table msgevent( 
   msgeventid int not null auto_increment,
   msgtype char(1),
   objtype1 char(1),
   objid1 int,
   objtype2 char(1),
   objid2 int,
   status char(1),
   description varchar(1024),
   createtime timestamp not null default current_timestamp,
   sendtime datetime,
   primary key (msgeventid)
 )engine = innodb
default character set utf8;

create table crashreport( 
   crashreportid int not null auto_increment,
   hardkey varchar(64),
   terminalid varchar(64),
   clientip varchar(32),
   clientname varchar(64),
   os varchar(32),
   appname varchar(32),
   vname varchar(32),
   vcode varchar(32),
   stack longtext,
   resolution varchar(1024),
   other varchar(1024),
   createtime timestamp not null default current_timestamp,
   primary key (crashreportid)
 )engine = innodb
default character set utf8;

create table selfapply( 
   selfapplyid int not null auto_increment,
   email varchar(64) not null,
   mobile varchar(16),
   name varchar(64),
   orgname varchar(64),
   orgcode varchar(16),
   description varchar(1024),
   status char(1),
   auditmemo varchar(1024),
   createtime timestamp not null default current_timestamp,
   primary key (selfapplyid)
 )engine = innodb
default character set utf8;


############################################################
## init data  ##############################################
############################################################

INSERT INTO vsp(name,code,status) VALUES('PIX','root','1');

INSERT INTO staff(subsystem,vspid,loginname,password,name,status,token) VALUES('1',1,'admin','9c6e77902e2a6feca343509566af87ff','admin','1','admin_5926b1fafa508d17ff6e7a1c41e17b0f');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(0,'',0,'SUPER','','',2,1,'0');
INSERT INTO staffprivilege(staffid,privilegeid) VALUES(1,0);

INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(101,1,0,'运营管理','','fa-cloud',1,1,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(10101,1,101,'企业管理','org.jsp','',1,1,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(10102,1,101,'审核申请','audit.jsp','',1,2,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(109,1,0,'系统管理','','fa-cogs',1,9,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(10901,1,109,'操作员管理','staff.jsp','',1,1,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(10902,1,109,'角色管理','role.jsp','',1,2,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(10909,1,109,'系统配置','config.jsp','',1,9,'0');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(10910,1,109,'终端调试','crashreport.jsp','',1,10,'0');

INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(301,2,0,'快速发布','wizard.jsp','fa-hand-o-up',1,1,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(201,2,0,'素材管理','','fa-video-camera',1,2,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20101,2,201,'播放列表','medialist.jsp','',1,1,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20102,2,201,'本地视频','video-int.jsp','',1,2,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20103,2,201,'引入视频','video-ext.jsp','',1,3,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20104,2,201,'图片','image.jsp','',1,4,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20105,2,201,'文本','text.jsp','',1,5,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20106,2,201,'视频流','stream.jsp','',1,6,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20107,2,201,'数字频道','dvb.jsp','',1,7,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20108,2,201,'Widget','widget.jsp','',1,8,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(202,2,0,'终端管理','','fa-desktop',1,3,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20201,2,202,'终端','device.jsp','',1,1,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20202,2,202,'终端组','devicegp.jsp','',1,2,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(203,2,0,'播出管理','','fa-calendar',1,4,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20301,2,203,'布局设计','layout-design.jsp','',1,1,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20302,2,203,'布局计划','layout-schedule.jsp','',1,2,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20303,2,203,'播出计划','schedule.jsp','',1,3,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(209,2,0,'系统管理','','fa-cogs',1,10,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20901,2,209,'操作员管理','staff.jsp','',1,1,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20902,2,209,'角色管理','role.jsp','',1,2,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20903,2,209,'部门管理','branch.jsp','',1,3,'1');
INSERT INTO privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) VALUES(20909,2,209,'系统配置','config.jsp','',1,9,'1');

INSERT INTO region(regionid,name,code,type) VALUES(1,'主区域','main','0');
INSERT INTO region(regionid,name,code,type) VALUES(2,'文本区域','text','1');
INSERT INTO region(regionid,name,code,type) VALUES(3,'附加区域1','extra-1','0');
INSERT INTO region(regionid,name,code,type) VALUES(4,'附加区域2','extra-2','0');
INSERT INTO region(regionid,name,code,type) VALUES(5,'附加区域3','extra-3','0');

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version,createtime=now() where type='0';
