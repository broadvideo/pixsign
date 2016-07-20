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
   reviewflag char(1) default '0',
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
   currentdevices int default 0,
   currentstorage bigint default 0,
   currentdeviceidx int,
   copyright varchar(512),
   description varchar(512),
   backupvideoid int,
   powerflag char(1) default '0',
   poweron time,
   poweroff time,
   devicepass varchar(32) default '123456',
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
   width int default 0,
   height int default 0,
   filepath varchar(32),
   filename varchar(128),
   size bigint,
   md5 varchar(64),
   status char(1) default '1',
   objtype char(1) not null default '0',
   objid int default 0,
   description varchar(512),
   thumbnail varchar(128),
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
   uuid varchar(64) not null,
   type char(1) default '1',
   width int default 0,
   height int default 0,
   filepath varchar(32),
   filename varchar(128),
   size bigint,
   md5 varchar(64),
   previewflag char(1) default '0',
   status char(1) default '1',
   progress int,
   description varchar(1024),
   thumbnail varchar(128),
   relateid int default 0,
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
   branchid int not null,
   name varchar(256) not null,
   text longtext not null default '',
   type char(1) default 1,
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
   branchid int not null,
   name varchar(256) not null,
   url varchar(1024) not null,
   type char(1) default 1,
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
   branchid int not null,
   name varchar(256) not null,
   frequency varchar(32) not null,
   number varchar(16) not null,
   type char(1) default 1,
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
   branchid int not null,
   name varchar(256) not null,
   url varchar(1024) not null,
   type char(1) default 1,
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
   type char(1) default 1,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (medialistid),
   foreign key (orgid) references org(orgid)
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
alter table medialistdtl add foreign key medialistdtl_fk1(medialistid) references medialist(medialistid);
alter table medialistdtl add index medialistdtl_index1(objtype, objid);

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
   lontitude varchar(32),
   latitude varchar(32),
   city varchar(64),
   addr1 varchar(128),
   addr2 varchar(128),
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
   status char(1) default '1',
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
   branchid int not null,
   name varchar(64) not null,
   type char(1) default '0',
   status char(1) default '1',
   ratio char(1) default '1',
   height int not null,
   width int not null,
   bgcolor varchar(8) default '#000000',
   bgimageid int default 0,
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
   zindex int not null default 0,
   bgcolor varchar(8) default '#000000',
   opacity int default 255,
   bgimageid int default 0,
   intervaltime int default 10,
   direction char(1) default '4',
   speed char(1) default '2',
   color varchar(8) default '#FFFFFF',
   size int default 30,
   dateformat varchar(32),
   fitflag char(1) default 1,
   volume int default 50,
   createtime timestamp not null default current_timestamp,
   primary key (layoutdtlid),
   foreign key (layoutid) references layout(layoutid),
   foreign key (regionid) references region(regionid)
 )engine = innodb
default character set utf8;

create table bundle( 
   bundleid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   layoutid int not null,
   name varchar(64) not null,
   snapshot varchar(128),
   height int not null,
   width int not null,
   status char(1) default '1',
   reviewflag char(1) default '1',
   comment varchar(1024) default '',
   json longtext,
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (bundleid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table bundledtl( 
   bundledtlid int not null auto_increment,
   bundleid int not null,
   regionid int not null,
   type char(1) not null,
   objtype char(1) not null,
   objid int not null,
   createtime timestamp not null default current_timestamp,
   primary key (bundledtlid)
 )engine = innodb
default character set utf8;
alter table bundledtl add foreign key bundledtl_fk1(bundleid) references bundle(bundleid);
alter table bundledtl add index bundledtl_index1(objtype, objid);

create table bundleschedule( 
   bundlescheduleid int not null auto_increment,
   bindtype char(1) not null,
   bindid int not null,
   bundleid int not null,
   playmode char(1) not null,
   playdate date,
   starttime time,
   endtime time,
   createtime timestamp not null default current_timestamp,
   primary key (bundlescheduleid),
   foreign key (bundleid) references bundle(bundleid)
 )engine = innodb
default character set utf8;
alter table bundleschedule add foreign key bundleschedule_fk1(bundleid) references bundle(bundleid);
alter table bundleschedule add index bundleschedule_index1(bindtype, bindid);

create table bundlescheduledtl( 
   bundlescheduledtlid int not null auto_increment,
   bundlescheduleid int not null,
   bundleid int not null,
   sequence int not null,
   primary key (bundlescheduledtlid)
 )engine = innodb
default character set utf8;
alter table bundlescheduledtl add foreign key bundlescheduledtl_fk1(bundlescheduleid) references bundleschedule(bundlescheduleid);
alter table bundlescheduledtl add foreign key bundlescheduledtl_fk2(bundleid) references bundle(bundleid);

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

create table vchannel( 
   vchannelid int not null auto_increment,
   orgid int not null,
   name varchar(64) not null,
   uuid varchar(64) not null,
   backupvideoid int,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   primary key (vchannelid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table vchannelschedule( 
   vchannelscheduleid int not null auto_increment,
   vchannelid int not null,
   playmode char(1) not null,
   playdate date,
   starttime time,
   endtime time,
   playlistid int not null,
   createtime timestamp not null default current_timestamp,
   primary key (vchannelscheduleid),
   foreign key (vchannelid) references vchannel(vchannelid)
 )engine = innodb
default character set utf8;

create table playlist( 
   playlistid int not null auto_increment,
   orgid int not null,
   name varchar(256) not null,
   type char(1) default '0',
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (playlistid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table playlistdtl( 
   playlistdtlid int not null auto_increment,
   playlistid int not null,
   videoid int not null,
   sequence int not null,
   primary key (playlistdtlid)
 )engine = innodb
default character set utf8;

create table devicefile( 
   devicefileid int not null auto_increment,
   deviceid int not null,
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
alter table devicefile add foreign key devicefile_fk1(deviceid) references device(deviceid);
alter table devicefile add index devicefile_index1(objtype, objid);

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

create table weather( 
   weatherid int not null auto_increment,
   city varchar(64) not null unique,
   weather longtext not null default '',
   status char(1) default '1',
   refreshtime datetime,
   primary key (weatherid)
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

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(0,'',0,'SUPER','','',2,1,'0');

insert into staff(subsystem,loginname,password,name) values(0,'root','965f91221572c93b065bff68ae291c50','root');
select last_insert_id() into @staffid1;
insert into staff(subsystem,loginname,password,name) values(0,'super','6b848c0a3a448dae8d480ac6902214bb','super');
select last_insert_id() into @staffid2;
insert into staff(subsystem,loginname,password,name) values(0,'admin','9c6e77902e2a6feca343509566af87ff','admin');
select last_insert_id() into @staffid3;
insert into staffprivilege(staffid,privilegeid) values(@staffid1,0);
insert into staffprivilege(staffid,privilegeid) values(@staffid2,0);
insert into staffprivilege(staffid,privilegeid) values(@staffid3,0);

insert into vsp(name,code,createstaffid) values('default','default',@staffid1);
select last_insert_id() into @vspid;
insert into org(vspid,name,code,expireflag,expiretime,maxdevices,maxstorage,currentdeviceidx,description,createstaffid) values(@vspid,'default','default',0,'2037-01-01 00:00:00',20,30000,20,'Default Org',@staffid2);
select last_insert_id() into @orgid;
insert into branch(orgid,parentid,name,code,description,createstaffid) values(@orgid,0,'super','root','Default Root Branch',@staffid3);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(101,0,0,'menu.opmanage','','fa-cloud',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10101,0,101,'menu.vsp','vsp.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10901,0,109,'menu.config','config.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10902,0,109,'menu.debug','crashreport.jsp','',1,2,'0');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(201,1,0,'menu.org','org.jsp','fa-cloud',1,1,'0');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(300,2,0,'menu.wizard','wizard.jsp','fa-hand-o-up',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(301,2,0,'menu.resource','','fa-qrcode',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30101,2,301,'menu.medialist','medialist.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30102,2,301,'menu.intvideo','video-int.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30103,2,301,'menu.extvideo','video-ext.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30104,2,301,'menu.image','image.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30105,2,301,'menu.text','text.jsp','',1,5,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30106,2,301,'menu.stream','stream.jsp','',1,6,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30107,2,301,'menu.dvb','dvb.jsp','',1,7,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30108,2,301,'menu.widget','widget.jsp','',1,8,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30201,2,302,'menu.device','device.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30202,2,302,'menu.devicegroup','devicegp.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30203,2,302,'menu.devicefile','devicefile.jsp','',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30204,2,302,'menu.config','config.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(303,2,0,'menu.schedulemanage','','fa-calendar',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30301,2,303,'menu.layout','layout.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30302,2,303,'menu.bundle','bundle.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30303,2,303,'menu.deviceschedule','device-schedule.jsp','',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30304,2,303,'menu.devicegpschedule','devicegp-schedule.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(304,2,0,'menu.page','','fa-video-camera',1,5,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30401,2,304,'menu.template','template.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30402,2,304,'menu.pagepkg','pagepkg.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(305,2,0,'menu.review','','fa-eye',1,6,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30501,2,305,'menu.bundlereview','bundle-review.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(306,2,0,'menu.vstation','','fa-video-camera',1,7,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30601,2,306,'menu.vchannel','vchannel.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30602,2,306,'menu.playlist','vchannel-playlist.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30603,2,306,'menu.vchannelschedule','vchannel-schedule.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(309,2,0,'menu.systemmanage','','fa-cogs',1,10,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30901,2,309,'menu.staff','staff.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30902,2,309,'menu.role','role.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30903,2,309,'menu.branch','branch.jsp','',1,3,'12');

insert into region(regionid,name,code,type) values(1,'region.main','main','0');
insert into region(regionid,name,code,type) values(2,'region.text_1','text-1','1');
insert into region(regionid,name,code,type) values(3,'region.text_2','text-2','1');
insert into region(regionid,name,code,type) values(4,'region.extra_1','extra-1','0');
insert into region(regionid,name,code,type) values(5,'region.extra_2','extra-2','0');
insert into region(regionid,name,code,type) values(6,'region.extra_3','extra-3','0');
insert into region(regionid,name,code,type) values(7,'region.extra_4','extra-4','0');
insert into region(regionid,name,code,type) values(8,'region.date_1','date-1','2');
insert into region(regionid,name,code,type) values(9,'region.date_2','date-2','2');

insert into region(regionid,name,code,type) values(1,'region.main','main','0');
insert into region(regionid,name,code,type) values(10,'region.play_1','play-1','0');
insert into region(regionid,name,code,type) values(11,'region.play_2','play-2','0');
insert into region(regionid,name,code,type) values(12,'region.play_3','play-3','0');
insert into region(regionid,name,code,type) values(13,'region.play_4','play-4','0');
insert into region(regionid,name,code,type) values(14,'region.play_5','play-5','0');
insert into region(regionid,name,code,type) values(20,'region.text_1','text-1','1');
insert into region(regionid,name,code,type) values(21,'region.text_2','text-2','1');
insert into region(regionid,name,code,type) values(22,'region.text_3','text-3','1');
insert into region(regionid,name,code,type) values(30,'region.date_1','date-1','2');
insert into region(regionid,name,code,type) values(31,'region.date_2','date-2','2');
insert into region(regionid,name,code,type) values(35,'region.weather','weather','3');
insert into region(regionid,name,code,type) values(40,'region.videoin','videoin','4');
insert into region(regionid,name,code,type) values(45,'region.dvb','dvb','5');

insert into layout(orgid,name,type,status,ratio,height,width,createstaffid) values(@orgid,'横屏-单区域',0,1,1,1080,1920,@staffid);
select last_insert_id() into @layoutid;
insert into layoutdtl(layoutid,regionid,height,width,topoffset,leftoffset) values(@layoutid,1,1080,1920,0,0);

insert into layout(orgid,name,type,status,ratio,height,width,createstaffid) values(@orgid,'横屏-带字幕',0,1,1,1080,1920,@staffid);
select last_insert_id() into @layoutid;
insert into layoutdtl(layoutid,regionid,height,width,topoffset,leftoffset) values(@layoutid,1,977,1920,0,0);
insert into layoutdtl(layoutid,regionid,height,width,topoffset,leftoffset) values(@layoutid,2,100,1920,980,0);


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
