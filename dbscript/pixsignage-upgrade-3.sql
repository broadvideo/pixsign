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
alter table bundledtl add touchlabel varchar(128);
alter table bundledtl add touchtype char(1) default '0';
alter table bundledtl add touchbundleid int default 0;

alter table vsp add reviewflag char(1) default '0';
alter table vsp add touchflag char(1) default '0';
alter table vsp add liftflag char(1) default '0';
alter table vsp add streamflag char(1) default '0';
alter table vsp add dvbflag char(1) default '0';
alter table vsp add videoinflag char(1) default '0';
alter table vsp add apps varchar(128);

alter table org add touchflag char(1) default '0';
alter table org add liftflag char(1) default '0';
alter table org add videoinflag char(1) default '0';
alter table org add apps varchar(128);

update layoutdtl set mainflag=1 where regionid=1;
update layoutdtl ld, region r set ld.type=r.type where ld.regionid=r.regionid;

update bundledtl set homebundleid=bundleid;

update bundle b, bundledtl bd, layoutdtl ld set bd.layoutdtlid=ld.layoutdtlid where b.bundleid=bd.bundleid and b.layoutid=ld.layoutid and bd.regionid=ld.regionid;

alter table layoutdtl drop regionid;
alter table bundledtl drop regionid;

insert into app(appid,name,mainboard,subdir,description) values(100,'DigitalBox_APP_VE','A83T','a83t','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(101,'DigitalBox_LAUNCHER_VE','A83T','a83t','通用Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(102,'DigitalBox_APP_UWIN_SINGLE','A83T','a83t','单屏APP版');
insert into app(appid,name,mainboard,subdir,description) values(103,'DigitalBox_LAUNCHER_UWIN_SINGLE','A83T','a83t','单屏Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(104,'DigitalBox_LAUNCHER_UWIN','A83T','a83t','双屏Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(105,'DigitalBox_LAUNCHER_UWIN_JIM','A83T','a83t','AK定制版');

insert into app(appid,name,mainboard,subdir,description) values(200,'DigitalBox_APP_VE','RK3288','3288','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(201,'DigitalBox_LAUNCHER_VE','RK3288','3288','通用Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(202,'DigitalBox_APP','RK3288','3288','单屏APP版');
insert into app(appid,name,mainboard,subdir,description) values(203,'DigitalBox_LAUNCHER','RK3288','3288','单屏Launcher版');
insert into app(appid,name,mainboard,subdir,description) values(204,'DigitalBox_LAUNCHER_SHANXI','RK3288','3288','Launcher版(投影仪控制)');

insert into app(appid,name,mainboard,subdir,description) values(300,'DigitalBox_APP_VE','RK3368','3368','通用APP版');
insert into app(appid,name,mainboard,subdir,description) values(301,'DigitalBox_LAUNCHER_VE','RK3368','3368','通用Launcher版');

delete from privilege where privilegeid > 0;
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
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30303,2,303,'menu.touchbundle','bundle-touch.jsp','',1,3,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30304,2,303,'menu.deviceschedule','device-schedule.jsp','',1,4,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30305,2,303,'menu.devicegpschedule','devicegp-schedule.jsp','',1,5,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(305,2,0,'menu.review','','fa-eye',1,6,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30501,2,305,'menu.bundlereview','bundle-review.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(309,2,0,'menu.systemmanage','','fa-cogs',1,10,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30901,2,309,'menu.staff','staff.jsp','',1,1,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30902,2,309,'menu.role','role.jsp','',1,2,'12');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(30903,2,309,'menu.branch','branch.jsp','',1,3,'12');

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
