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

delete from privilege where privilegeid>0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(101,1,0,'menu.opmanage','','fa-cloud',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10101,1,101,'menu.org','org.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(109,1,0,'menu.systemmanage','','fa-cogs',1,9,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10901,1,109,'menu.staff','staff.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10902,1,109,'menu.role','role.jsp','',1,2,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10909,1,109,'menu.config','config.jsp','',1,9,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10910,1,109,'menu.debug','crashreport.jsp','',1,10,'0');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(301,2,0,'menu.wizard','wizard.jsp','fa-hand-o-up',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(201,2,0,'menu.resource','','fa-qrcode',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20101,2,201,'menu.medialist','medialist.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20102,2,201,'menu.intvideo','video-int.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20103,2,201,'menu.extvideo','video-ext.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20104,2,201,'menu.image','image.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20105,2,201,'menu.text','text.jsp','',1,5,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20106,2,201,'menu.stream','stream.jsp','',1,6,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20107,2,201,'menu.dvb','dvb.jsp','',1,7,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20108,2,201,'menu.widget','widget.jsp','',1,8,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(202,2,0,'menu.devicemanage','','fa-desktop',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20201,2,202,'menu.device','device.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20202,2,202,'menu.devicegroup','devicegp.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20203,2,202,'menu.devicefile','devicefile.jsp','',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20204,2,202,'menu.config','config.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(203,2,0,'menu.schedulemanage','','fa-calendar',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20301,2,203,'menu.layout','layout.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20302,2,203,'menu.bundle','bundle.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20303,2,203,'menu.deviceschedule','device-schedule.jsp','',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20304,2,203,'menu.devicegpschedule','devicegp-schedule.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(204,2,0,'menu.vstation','','fa-video-camera',1,5,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20401,2,204,'menu.vchannel','vchannel.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20402,2,204,'menu.playlist','vchannel-playlist.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20403,2,204,'menu.vchannelschedule','vchannel-schedule.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(209,2,0,'menu.systemmanage','','fa-cogs',1,10,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20901,2,209,'menu.staff','staff.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20902,2,209,'menu.role','role.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20903,2,209,'menu.branch','branch.jsp','',1,3,'12');

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
