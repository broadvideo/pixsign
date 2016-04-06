############################################################
## pre script  #############################################
############################################################

set @version = 5;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-4.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table text add type char(1) default 1;
alter table text modify text longtext not null default '';
alter table stream add type char(1) default 1;
alter table dvb add type char(1) default 1;
alter table widget add type char(1) default 1;
alter table medialist add type char(1) default 1;

create table bundle( 
   bundleid int not null auto_increment,
   orgid int not null,
   layoutid int not null,
   name varchar(64) not null,
   status char(1) default '1',
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

alter table device add lontitude varchar(32);
alter table device add latitude varchar(32);
alter table device add city varchar(64);
alter table device add addr1 varchar(128);
alter table device add addr2 varchar(128);
create table weather( 
   weatherid int not null auto_increment,
   city varchar(64) not null unique,
   weather longtext not null default '',
   status char(1) default '1',
   refreshtime datetime,
   primary key (weatherid)
 )engine = innodb
default character set utf8;

alter table video add previewflag char(1) default '0';

delete from privilege where privilegeid>0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(101,0,0,'menu.opmanage','','fa-cloud',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10101,0,101,'menu.vsp','vsp.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10901,0,109,'menu.config','config.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10902,0,109,'menu.debug','crashreport.jsp','',1,2,'0');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(201,1,0,'menu.org','org.jsp','fa-cloud',1,1,'0');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(308,2,0,'menu.wizard','wizard.jsp','fa-hand-o-up',1,1,'12');
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
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(304,2,0,'menu.vstation','','fa-video-camera',1,5,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30401,2,304,'menu.vchannel','vchannel.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30402,2,304,'menu.playlist','vchannel-playlist.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30403,2,304,'menu.vchannelschedule','vchannel-schedule.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(309,2,0,'menu.systemmanage','','fa-cogs',1,10,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30901,2,309,'menu.staff','staff.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30902,2,309,'menu.role','role.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30903,2,309,'menu.branch','branch.jsp','',1,3,'12');

alter table branch drop code;

alter table text add branchid int;
alter table stream add branchid int;
alter table dvb add branchid int;
alter table widget add branchid int;
alter table medialist add branchid int;
alter table layout add branchid int;
alter table bundle add branchid int;
update text a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
update stream a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
update dvb a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
update widget a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
update medialist a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
update layout a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
update bundle a, branch b set a.branchid=b.branchid where a.orgid=b.orgid and b.parentid=0;
alter table text modify branchid int not null;
alter table stream modify branchid int not null;
alter table dvb modify branchid int not null;
alter table widget modify branchid int not null;
alter table medialist modify branchid int not null;
alter table layout modify branchid int not null;
alter table bundle modify branchid int not null;

alter table devicegroup drop code;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
