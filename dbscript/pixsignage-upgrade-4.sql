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

create table wxinfo( 
   wxinfoid int not null auto_increment,
   orgid int not null,
   wxappid varchar(32) default '',
   wxsecret varchar(64) default '',
   validflag char(1) default '0',
   comment varchar(1024) default '',
   accesstocken varchar(256) default '',
   applytime datetime,
   expiretime datetime,
   primary key (wxinfoid)
 )engine = innodb
default character set utf8;

create table wxdeviceapply( 
   wxdeviceapplyid int not null auto_increment,
   orgid int not null,
   name varchar(128) default '',
   count int default 0,
   reason varchar(512) default '',
   applytime datetime,
   applyid int default 0,
   status char(1) default '1',
   comment varchar(1024) default '',
   audittime datetime,
   primary key (wxdeviceapplyid)
 )engine = innodb
default character set utf8;

create table wxdevice( 
   wxdeviceid int not null,
   orgid int not null,
   wxdeviceapplyid int default 0,
   uuid varchar(64) default '',
   major int default 0,
   minor int default 0,
   wxstatus char(1) default '0',
   activetime datetime,
   poiid int default 0,
   comment varchar(512) default '',
   deviceid int default 0,
   bindtime datetime,
   createtime timestamp not null default current_timestamp,
   primary key (wxdeviceid)
 )engine = innodb
default character set utf8;

insert into wxinfo(orgid) select orgid from org where status=1;

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(307,2,0,'menu.weixin','','fa-weixin',1,8,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30701,2,307,'menu.wxinfo','wxinfo.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30702,2,307,'menu.wxdeviceapply','wxdeviceapply.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30703,2,307,'menu.wxdevice','wxdevice.jsp','',1,3,'12');


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
