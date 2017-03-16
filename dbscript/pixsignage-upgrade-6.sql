############################################################
## pre script  #############################################
############################################################

set @version = 7;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-6.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table pflowlog add index pflowlog_index1(deviceid);
alter table playlog add index playlog_index1(deviceid);
alter table onlinelog add index onlinelog_index1(deviceid);

create table debugreport( 
   debugreportid int not null auto_increment,
   deviceid int,
   hardkey varchar(64),
   filepath varchar(64),
   createtime timestamp not null default current_timestamp,
   primary key (debugreportid)
 )engine = innodb
default character set utf8;

create table flowlog( 
   flowlogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   deviceid int not null,
   uuid varchar(32) not null,
   starttime datetime,
   endtime datetime,
   total int default 0,
   male int default 0,
   female int default 0,
   age1 int default 0,
   age2 int default 0,
   age3 int default 0,
   age4 int default 0,
   age5 int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (flowlogid)
 )engine = innodb
default character set utf8;
alter table flowlog add index flowlog_index1(deviceid);
alter table flowlog add unique(deviceid, uuid);

create table templet( 
   templetid int not null auto_increment,
   uuid varchar(64) not null,
   orgid int not null,
   name varchar(64) not null,
   snapshot varchar(128),
   ratio char(1) default '1',
   height int not null,
   width int not null,
   bgcolor varchar(8) default '#000000',
   bgimageid int default 0,
   touchflag char(1) default '0',
   homeflag char(1) default '1',
   hometempletid int default 0,
   homeidletime int default 0,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (templetid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table templetdtl( 
   templetdtlid int not null auto_increment,
   templetid int not null,
   hometempletid int,
   type varchar(2) default '0',
   mainflag char(1) default '0',
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   bgcolor varchar(8) default '#000000',
   opacity int default 255,
   bgimageid int default 0,
   sleeptime int default 0,
   intervaltime int default 10,
   animation varchar(32) default 'None',
   direction char(1) default '4',
   speed char(1) default '2',
   color varchar(8) default '#FFFFFF',
   size int default 30,
   dateformat varchar(32),
   fitflag char(1) default 1,
   volume int default 50,
   objtype char(1) not null,
   objid int not null,
   touchlabel varchar(128) default '',
   touchtype char(1) default '0',
   touchtempletid int default 0,
   touchapk varchar(128) default '',
   createtime timestamp not null default current_timestamp,
   primary key (templetdtlid),
   foreign key (templetid) references templet(templetid)
 )engine = innodb
default character set utf8;


delete from privilege where parentid=109;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10901,0,109,'menu.config','config.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3,'0');

delete from privilege where parentid=303;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30301,2,303,'menu.layout','layout.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30302,2,303,'menu.bundle','bundle.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30303,2,303,'menu.touchbundle','bundle-touch.jsp','',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30304,2,303,'menu.deviceschedule','device-schedule.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30305,2,303,'menu.devicegpschedule','devicegp-schedule.jsp','',1,5,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30306,2,303,'menu.templet','templet.jsp','',1,6,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30307,2,303,'menu.touchtemplet','templet-touch.jsp','',1,7,'12');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30822,2,308,'menu.flowlog','flowlog.jsp','',1,22,'12');


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
