############################################################
## pre script  #############################################
############################################################

set @version = 4;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-3.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

create table app( 
   appid int not null,
   name varchar(64) not null,
   mainboard varchar(16),
   subdir varchar(16),
   description varchar(512),
   primary key (appid)
 )engine = innodb
default character set utf8;

create table sdomain( 
   sdomainid int not null auto_increment,
   name varchar(128) not null,
   code varchar(32) not null,
   langflag char(1) default '0',
   description varchar(512),
   primary key (sdomainid)
 )engine = innodb
default character set utf8;
alter table sdomain add unique(code);

alter table layoutdtl add type varchar(2) default '0';
alter table layoutdtl add mainflag char(1) default '0';

alter table bundle add touchflag char(1) default '0';
alter table bundle add homeflag char(1) default '1';
alter table bundle add homebundleid int default 0;
alter table bundle add homeidletime int default 0;

alter table bundledtl add homebundleid int;
alter table bundledtl add layoutdtlid int default 0;
alter table bundledtl add touchlabel varchar(128) default '';
alter table bundledtl add touchtype char(1) default '0';
alter table bundledtl add touchbundleid int default 0;
alter table bundledtl add touchapk varchar(128) default '';

alter table vsp add reviewflag char(1) default '0';
alter table vsp add touchflag char(1) default '0';
alter table vsp add liftflag char(1) default '0';
alter table vsp add calendarflag char(1) default '0';
alter table vsp add streamflag char(1) default '0';
alter table vsp add dvbflag char(1) default '0';
alter table vsp add videoinflag char(1) default '0';
alter table vsp add apps varchar(128);

alter table org add touchflag char(1) default '0';
alter table org add liftflag char(1) default '0';
alter table org add calendarflag char(1) default '0';
alter table org add videoinflag char(1) default '0';
alter table org add apps varchar(128);
alter table org add devicepassflag char(1) default '1';
alter table org add upgradeflag char(1) default '0';

alter table device modify position varchar(512) default '';
alter table device modify addr1 varchar(256) default '';
alter table device modify addr2 varchar(256) default '';
alter table device add externalid varchar(64) default '';
alter table device add externalname varchar(128) default '';

alter table layoutdtl add animation varchar(32) default 'None';

alter table layoutdtl add calendartype char(1) default '2';

create table folder( 
   folderid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   parentid int,
   name varchar(64) not null,
   status char(1) default '1',
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (folderid)
 )engine = innodb
default character set utf8;

alter table branch add topfolderid int;
alter table image add folderid int;
alter table video add folderid int;

create table onlinelog( 
   onlinelogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   deviceid int not null,
   onlinetime datetime,
   offlinetime datetime,
   duration int default 0,
   primary key (onlinelogid)
 )engine = innodb
default character set utf8;

create table playlog( 
   playlogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   deviceid int not null,
   starttime datetime,
   endtime datetime,
   duration int default 0,
   bundleid int,
   layoutdtlid int,
   mediatype char(1),
   mediaid int,
   primary key (playlogid)
 )engine = innodb
default character set utf8;

create table oplog( 
   oplogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   staffid int not null,
   type char(2),
   objtype1 char(1) default '',
   objid1 int default 0,
   objname1 varchar(512),
   objtype2 char(1) default '',
   objid2 int default 0,
   objname2 varchar(512),
   status char(1) default '1',
   description varchar(1024),
   createtime timestamp not null default current_timestamp,
   primary key (oplogid)
 )engine = innodb
default character set utf8;

create table pflowlog( 
   pflowlogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   deviceid int not null,
   starttime datetime,
   endtime datetime,
   duration int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (pflowlogid)
 )engine = innodb
default character set utf8;

create table rss( 
   rssid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(256) not null,
   url varchar(1024) not null,
   type char(1) default 1,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (rssid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

insert into folder(orgid,branchid,parentid,name) select orgid,branchid,0,'/' from branch where status!='9' order by branchid;
update branch b, folder f set b.topfolderid=f.folderid where b.branchid=f.branchid;
update image i, folder f set i.folderid=f.folderid where i.branchid=f.branchid;
update video v, folder f set v.folderid=f.folderid where v.branchid=f.branchid;

update layoutdtl set mainflag=1 where regionid=1;
update layoutdtl ld, region r set ld.type=r.type where ld.regionid=r.regionid;

update bundledtl set homebundleid=bundleid;

update bundle b, bundledtl bd, layoutdtl ld set bd.layoutdtlid=ld.layoutdtlid where b.bundleid=bd.bundleid and b.layoutid=ld.layoutid and bd.regionid=ld.regionid;

alter table layoutdtl drop regionid;
alter table bundledtl drop regionid;

insert into app(appid,name,mainboard,subdir,description) values(100,'DigitalBox_APP_VE','Common','bv','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(101,'DigitalBox_LAUNCHER_VE','Common','bv','通用Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(102,'DigitalBox_APP_HDMIN','Common','bv','HDMI-IN版');

insert into app(appid,name,mainboard,subdir,description) values(200,'DigitalBox_APP_VE','A83T','a83t','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(201,'DigitalBox_LAUNCHER_VE','A83T','a83t','通用Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(202,'DigitalBox_APP_UWIN_SINGLE','A83T','a83t','单屏APP版');
insert into app(appid,name,mainboard,subdir,description) values(203,'DigitalBox_LAUNCHER_UWIN_SINGLE','A83T','a83t','单屏Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(204,'DigitalBox_LAUNCHER_UWIN','A83T','a83t','双屏Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(205,'DigitalBox_LAUNCHER_UWIN_JIM','A83T','a83t','AK定制版');

insert into app(appid,name,mainboard,subdir,description) values(300,'DigitalBox_APP_VE','RK3288','3288','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(301,'DigitalBox_LAUNCHER_VE','RK3288','3288','通用Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(302,'DigitalBox_APP','RK3288','3288','单屏APP版');
insert into app(appid,name,mainboard,subdir,description) values(303,'DigitalBox_LAUNCHER','RK3288','3288','单屏Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(304,'DigitalBox_LAUNCHER_SHANXI','RK3288','3288','Launcher版(投影仪控制)');

insert into app(appid,name,mainboard,subdir,description) values(400,'DigitalBox_APP_VE','RK3368','3368','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(401,'DigitalBox_LAUNCHER_VE','RK3368','3368','通用Launcher版');

insert into app(appid,name,mainboard,subdir,description) values(501,'PixMultiSign','Changhong','changhong','联屏版');

insert into config(configid, code, name, value, refer, type) values(101, 'ServerIP', 'config.server.ip', '127.0.0.1', '', '1');
insert into config(configid, code, name, value, refer, type) values(102, 'ServerPort', 'config.server.port', '80', '', '1');
insert into config(configid, code, name, value, refer, type) values(201, 'PixedxIP', 'config.pixedx.ip', '127.0.0.1', '', '1');
insert into config(configid, code, name, value, refer, type) values(202, 'PixedxPort', 'config.pixedx.port', '80', '', '1');

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
