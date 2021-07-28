############################################################
## pre script  #############################################
############################################################

set @version = 24;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-23.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;

############################################################
## upgrade script ##########################################
############################################################

create table adplan( 
   adplanid int not null auto_increment,
   orgid int not null,
   adplace varchar(32) not null,
   devicegroupid int not null,
   unitprice int default 0,
   primary key (adplanid)
 )engine = innodb
default character set utf8;
alter table adplan add unique key adplan_unique_index1(adplace, devicegroupid);

create table adplandtl( 
   adplandtlid int not null auto_increment,
   orgid int not null,
   adplanid int not null,
   adplace varchar(32) not null,
   devicegroupid int not null,
   adtype char(1) not null,
   adid int not null,
   duration int not null,
   times int default 1,
   months int default 1,
   starttime datetime,
   endtime datetime,
   unitprice int default 0,
   amount int default 0,
   status char(1) default '0',
   primary key (adplandtlid)
 )engine = innodb
default character set utf8;
alter table adplandtl add foreign key adplandtl_fk1(adplanid) references adplan(adplanid) on delete cascade on update cascade;

create table area( 
   areaid int not null auto_increment,
   orgid int not null,
   name varchar(64) not null,
   points varchar(2048) default '[]',
   primary key (areaid)
 )engine = innodb
default character set utf8;

create table advertarea( 
   advertareaid int not null auto_increment,
   adtype char(1) not null,
   adid int not null,
   areaid int not null,
   primary key (advertareaid)
 )engine = innodb
default character set utf8;
alter table advertarea add foreign key advertarea_fk1(areaid) references area(areaid) on delete cascade on update cascade;
alter table advertarea add unique key advertarea_unique_index1(adtype, adid, areaid);

alter table image add relatetype char(1) default '2';
alter table image add adflag char(1) default '0';
alter table video add duration int default 0;
alter table video add adflag char(1) default '0';


create table model( 
   modelid int not null auto_increment,
   name varchar(32) not null,
   model varchar(8) not null,
   prefix varchar(8) not null,
   programflag char(1) default 0,
   touchflag char(1) default 0,
   planflag char(1) default 0,
   currentdeviceidx int default 0,
   primary key (modelid)
 )engine = innodb
default character set utf8;

create table batch( 
   batchid int not null auto_increment,
   modelid int not null,
   name varchar(16) not null,
   amount int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (batchid)
 )engine = innodb
default character set utf8;

alter table device add batchid int default 0;
alter table device add modelid int default 0;
alter table device add qrcode varchar(256) default '';

alter table devicegroup add externalid varchar(8) default '';

alter table pagezone add volume int default 50;
alter table pagezone add speed int default 5;
alter table pagezone add intervaltime int default 10;
alter table pagezone add effect varchar(16) default 'slide';
alter table templatezone add volume int default 50;
alter table templatezone add speed int default 5;
alter table templatezone add intervaltime int default 10;
alter table templatezone add effect varchar(16) default 'slide';

alter table device add nextpoweron bigint default 0;
alter table device add nextpoweroff bigint default 0;
alter table device add playbundleid int default 0;
alter table device add playpageid int default 0;
alter table device modify powerflag tinyint default 9;
update device set powerflag=9 where powerflag=2;

alter table schedule add attachflag char(1) default '0';
alter table video add relatetype char(1) default '2';
alter table video modify oname varchar(512);
alter table image modify oname varchar(512);
alter table device modify type varchar(2) default '0';
alter table device add defaultmedialistid int default 0;
alter table org modify currentdeviceidx int default 0;

alter table device add unique key device_unique_index1(terminalid);
alter table sdomain add unique key sdomain_unique_index1(code);

alter table device add backupvideoid int default 0;

update device set type=1 where status = 1 and appname like 'DigitalBox\_%' 
  and appname != 'DigitalBox_LAUNCHER_UWIN' and appname not like 'DigitalBox_LAUNCHER_TOUPING%'
  and appname not like '%\_DS';
update device set type=2 where status = 1 and (appname = 'DigitalBox_LAUNCHER_UWIN' or appname like '%\_DS');
update device set type=3 where status = 1 and appname like 'DigitalBox2\_%';
update device set type=4 where status = 1 and appname like 'TeaTable\_%';
update device set type=5 where status = 1 and appname like 'PixMultiSign%';
update device set type=6 where status = 1 and ostype = 2;
update device set type=7 where status = 1 and appname like 'DigitalBox_LAUNCHER_TOUPING%';

delete t from device d, devicefilehis t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, devicefile t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, schedule s, scheduledtl t where s.scheduleid=t.scheduleid and d.deviceid=s.bindid and s.bindtype=1 and (d.status=0 or d.type is null);
delete t from device d, schedule t where d.deviceid=t.bindid and t.bindtype=1 and (d.status=0 or d.type is null);
delete t from device d, planbind t where d.deviceid=t.bindid and t.bindtype=1 and (d.status=0 or d.type is null);
delete t from device d, onlinelog t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, monthlyplaylog t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, dailyplaylog t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, hourflowlog t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, pflowlog t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, flowlog t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete t from device d, msgevent t where d.deviceid=t.objid1 and t.objtype1=1 and (d.status=0 or d.type is null);
delete t from device d, debugreport t where d.deviceid=t.deviceid and (d.status=0 or d.type is null);
delete from device where type is null;

alter table hourflowlog add look1 int default 0;
alter table hourflowlog add look2 int default 0;

create table intent( 
   intentid int not null auto_increment,
   orgid int not null,
   intentkey varchar(128) not null,
   relatetype char(1) default 0,
   relateid int default 0,
   relateurl varchar(256) default '',
   primary key (intentid)
 )engine = innodb
default character set utf8;

alter table device add unique key device_unique_index2(hardkey);

create table routeguide( 
   routeguideid int not null auto_increment,
   name varchar(64) not null,
   code varchar(64) not null,
   type char(1) default 1,
   description varchar(128) default '',
   primary key (routeguideid)
 )engine = innodb
default character set utf8;
alter table routeguide add unique key routeguide_unique_index1(code);

create table route( 
   routeid int not null auto_increment,
   name varchar(64) not null,
   code varchar(64) not null,
   primary key (routeid)
 )engine = innodb
default character set utf8;
alter table route add unique key route_unique_index1(code);

create table routeguidedtl( 
   routeguidedtlid int not null auto_increment,
   routeguideid int not null,
   routeid int not null,
   routelines varchar(512),
   primary key (routeguidedtlid)
 )engine = innodb
default character set utf8;
alter table routeguidedtl add unique key routeguidedtl_unique_index1(routeguideid, routeid);


alter table devicefile drop foreign key devicefile_ibfk_1;
alter table devicefile drop foreign key devicefile_ibfk_2;
alter table devicefilehis drop foreign key devicefilehis_ibfk_1;
alter table devicefilehis drop foreign key devicefilehis_ibfk_2;
alter table devicefile add foreign key devicefile_fk1(deviceid) references device(deviceid) on delete cascade on update cascade;
alter table devicefilehis add foreign key devicefilehis_fk1(deviceid) references device(deviceid) on delete cascade on update cascade;

alter table routeguide add createtime timestamp not null default current_timestamp;
alter table routeguidedtl modify routelines varchar(1024);

alter table branch add maxstorage int default 0 after code;
alter table branch add currentstorage int default 0 after maxstorage;

delete from privilege where privilegeid > 0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.vsp','vsp.jsp','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(104,0,0,'menu.page','page.jsp','fa-html5',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(201,1,0,'menu.sdomain','sdomain.jsp','fa-desktop',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(202,1,0,'menu.org','org.jsp','fa-cloud',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(203,1,0,'型号管理','model.jsp','fa-cloud',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(204,1,0,'批次管理','batch.jsp','fa-cloud',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(205,1,0,'导览管理','routeguide.jsp','fa-cloud',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(300,2,0,'menu.wizard','bundle/wizard.jsp','fa-hand-o-up',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(301,2,0,'menu.resource','','fa-qrcode',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.video','resource/video.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','resource/image.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','resource/audio.jsp','',1,5);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30106,2,301,'menu.text','resource/text.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','resource/stream.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30108,2,301,'menu.dvb','resource/dvb.jsp','',1,8);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30109,2,301,'menu.widget','resource/widget.jsp','',1,9);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30110,2,301,'menu.rss','resource/rss.jsp','',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30111,2,301,'menu.diy','resource/diy.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30112,2,301,'Intent','resource/intent.jsp','',1,12);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30130,2,301,'楼盘','resource/house.jsp','',1,30);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30201,2,302,'menu.device','device/device.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30211,2,302,'menu.device1','device/device1.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30212,2,302,'menu.device2','device/device2.jsp','',1,12);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30213,2,302,'menu.device3','device/device3.jsp','',1,13);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30214,2,302,'menu.device4','device/device4.jsp','',1,14);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30215,2,302,'menu.device5','device/device5.jsp','',1,15);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30216,2,302,'menu.device6','device/device6.jsp','',1,16);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30217,2,302,'menu.device7','device/device7.jsp','',1,17);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30219,2,302,'menu.device9','device/device9.jsp','','1',19);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30220,2,302,'menu.device10','device/device10.jsp','','1',20);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30221,2,302,'menu.device11','device/device11.jsp','','1',21);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30222,2,302,'工行定制信发','device/device12.jsp','','1',22);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30223,2,302,'menu.device13','device/device13.jsp','','1',23);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30224,2,302,'芯华测温','device/device14.jsp','','1',24);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30225,2,302,'体感互动','device/device15.jsp','','1',25);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30226,2,302,'WindowsH5','device/device16.jsp','','1',26);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30240,2,302,'menu.devicegroup','device/devicegroup.jsp','',1,40);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30250,2,302,'menu.deviceconfig','device/deviceconfig.jsp','',1,50);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30251,2,302,'menu.appfile','device/appfile.jsp','',1,51);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30252,2,302,'menu.deviceversion','device/deviceversion.jsp','',1,52);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30260,2,302,'menu.catalog','device/catalog.jsp','',1,60);

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
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30500,2,305,'menu.playlist','plan/medialist.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','plan/schedule-solo.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30502,2,305,'menu.attachschedule','plan/schedule-solo-attach.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30503,2,305,'menu.devicebundle','plan/device-bundle.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30504,2,305,'menu.devicegroupbundle','plan/devicegroup-bundle.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30505,2,305,'menu.pageplan','plan/plan-page.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30506,2,305,'menu.pageplan','plan/device-page.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30507,2,305,'menu.bundleplan','plan/plan-bundle.jsp','',1,2);

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

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(320,2,0,'menu.admanage','','fa-group','1',9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(32001,2,320,'menu.advideo','advert/advideo.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(32002,2,320,'menu.adimage','advert/adimage.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(32003,2,320,'menu.adplan','advert/adplan.jsp','','1',3);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
