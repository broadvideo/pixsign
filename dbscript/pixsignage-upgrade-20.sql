############################################################
## pre script  #############################################
############################################################

set @version = 21;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-20.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table vsp add type char(1) default '1';

insert into vsp(name,code,type,createstaffid) values('VSP2C','system','2',1);
insert into staff(vspid,subsystem,loginname,password,name) values(2,0,'system','d1bbbfb6ea37738ba3e2b2c65e6afb91','system');
select last_insert_id() into @staffid4;
insert into staffprivilege(staffid,privilegeid) values(@staffid4,0);

drop table hourplaylog;
alter table dailyplaylog add persons int default 0;
alter table dailyplaylog add male int default 0;
alter table dailyplaylog add female int default 0;
alter table dailyplaylog add age1 int default 0;
alter table dailyplaylog add age2 int default 0;
alter table dailyplaylog add age3 int default 0;
alter table dailyplaylog add age4 int default 0;
alter table dailyplaylog add age5 int default 0;
alter table monthlyplaylog add persons int default 0;
alter table monthlyplaylog add male int default 0;
alter table monthlyplaylog add female int default 0;
alter table monthlyplaylog add age1 int default 0;
alter table monthlyplaylog add age2 int default 0;
alter table monthlyplaylog add age3 int default 0;
alter table monthlyplaylog add age4 int default 0;
alter table monthlyplaylog add age5 int default 0;

alter table device add interval1 int default 60;
alter table device add interval2 int default 60;

alter table staff add phone varchar(32) default '';
create table phonetoken( 
   phone varchar(32) not null,
   token varchar(6) not null,
   updatetime datetime,
   primary key (phone)
 )engine = innodb
default character set utf8;


alter table bundle add uuid varchar(64);
alter table bundle add updatetime datetime;
alter table bundle drop layoutid;
update bundle set uuid=replace(uuid(), '-', '') where uuid is null;

create table bundlezone( 
   bundlezoneid int not null auto_increment,
   bundleid int not null,
   homebundleid int,
   type tinyint not null,
   mainflag char(1) default '0',
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   bgimageid int default 0,
   sleeptime int default 0,
   intervaltime int default 10,
   animation varchar(32) default '',
   speed char(1) default '2',
   color varchar(32) default '#000000',
   size int default 50,
   dateformat varchar(32) default '',
   fitflag char(1) default '1',
   volume int default 50,
   touchlabel varchar(128) default '',
   touchtype char(1) default 9,
   touchobjid int default 0,
   content longtext,
   primary key (bundlezoneid),
   constraint bundlezone_ibfk_1 foreign key (bundleid) references bundle(bundleid) on delete cascade on update cascade
 )engine = innodb
default character set utf8;

create table bundlezonedtl( 
   bundlezonedtlid int not null auto_increment,
   bundlezoneid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   primary key (bundlezonedtlid),
   constraint bundlezonedtl_ibfk_1 foreign key (bundlezoneid) references bundlezone(bundlezoneid) on delete cascade on update cascade
 )engine = innodb
default character set utf8;

create table templetzone( 
   templetzoneid int not null auto_increment,
   templetid int not null,
   hometempletid int,
   type tinyint not null,
   mainflag char(1) default '0',
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   bgimageid int default 0,
   sleeptime int default 0,
   intervaltime int default 10,
   animation varchar(32) default '',
   speed char(1) default '2',
   color varchar(32) default '#000000',
   size int default 50,
   dateformat varchar(32) default '',
   fitflag char(1) default '1',
   volume int default 50,
   touchlabel varchar(128) default '',
   touchtype char(1) default 9,
   touchobjid int default 0,
   content longtext,
   primary key (templetzoneid),
   constraint templetzone_ibfk_1 foreign key (templetid) references templet(templetid) on delete cascade on update cascade
 )engine = innodb
default character set utf8;

create table templetzonedtl( 
   templetzonedtlid int not null auto_increment,
   templetzoneid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   primary key (templetzonedtlid),
   constraint templetzonedtl_ibfk_1 foreign key (templetzoneid) references templetzone(templetzoneid) on delete cascade on update cascade
 )engine = innodb
default character set utf8;


alter table bundlezone add oldid int default 0;
delete from bundledtl where type='A1';
delete from bundledtl where type='A2';
insert into bundlezone select 0,bundleid,homebundleid,1,0,height,width,0,0,50,'#FFFFFF',255,bgimageid,0,10,'None',2,'#000000',50,'yyyy-MM-dd HH:mm',1,50,'',0,0,'',0 from bundle where bgimageid>0 and homebundleid>0;
insert into bundlezone select 0,bundleid,bundleid,1,0,height,width,0,0,50,'#FFFFFF',255,bgimageid,0,10,'None',2,'#000000',50,'yyyy-MM-dd HH:mm',1,50,'',0,0,'',0 from bundle where bgimageid>0 and homebundleid=0;
insert into bundlezone select 0,bundleid,homebundleid,type,mainflag,height,width,topoffset,leftoffset,zindex,bgcolor,opacity,bgimageid,sleeptime,intervaltime,animation,speed,color,size,dateformat,fitflag,volume,touchlabel,touchtype,touchbundleid,'',bundledtlid from bundledtl;
insert into bundlezonedtl select 0,bz.bundlezoneid,mld.objtype,mld.objid,mld.sequence from medialist ml, medialistdtl mld, bundledtl bd, bundlezone bz where bd.type!='7' and bd.objtype='1' and ml.medialistid=bd.objid and bd.bundledtlid=bz.oldid and ml.medialistid=mld.medialistid;

update bundledtl bd, bundlezone bz set bz.type=14 where bd.type=6 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=15 where bd.type=4 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=16 where bd.type=5 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=6 where bd.type=3 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=5 where bd.type=2 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=4 where bd.type=1 and bd.direction=4 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=3 where bd.type=1 and bd.direction!=4 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=2 where bd.type=0 and bd.objtype=5 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=1 where bd.type=0 and bd.objtype=1 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz set bz.type=1 where bd.type=0 and bd.objtype=3 and bd.bundledtlid=bz.oldid;
update bundledtl bd, bundlezone bz 
  set bz.touchtype=6, bz.touchobjid=0, bz.content=bd.touchapk 
  where bd.touchtype='4' and bd.type='7' and bd.bundledtlid=bz.oldid;
update medialist ml, medialistdtl mld, bundledtl bd, bundlezone bz
  set bz.touchtype='3', bz.touchobjid=mld.objid
  where bd.touchtype='3' and bd.type='7' and bd.objtype='1' 
  and mld.objtype='1' and ml.medialistid=bd.objid 
  and bd.bundledtlid=bz.oldid and ml.medialistid=mld.medialistid;
update medialist ml, medialistdtl mld, bundledtl bd, bundlezone bz
  set bz.touchtype='4', bz.touchobjid=mld.objid
  where bd.touchtype='3' and bd.type='7' and bd.objtype='1' 
  and mld.objtype='2' and ml.medialistid=bd.objid 
  and bd.bundledtlid=bz.oldid and ml.medialistid=mld.medialistid;
update widget w, bundledtl bd, bundlezone bz
  set bz.touchtype='5', bz.touchobjid=0, bz.content=w.url
  where bd.touchtype='3' and bd.type='7' and bd.objtype='5' 
  and w.widgetid=bd.objid and bd.bundledtlid=bz.oldid;
update widget w, bundledtl bd, bundlezone bz
  set bz.content=w.url
  where bd.type='0' and bd.objtype='5' 
  and w.widgetid=bd.objid and bd.bundledtlid=bz.oldid;
update text t, bundledtl bd, bundlezone bz
  set bz.content=t.text
  where bd.type='1' and bd.objtype='2' 
  and t.textid=bd.objid and bd.bundledtlid=bz.oldid;
update bundlezone set zindex=50 where zindex=0;
update bundlezone set zindex=51 where zindex=1;
update bundlezone set zindex=52 where zindex=2;

alter table templetzone add oldid int default 0;
delete from templetdtl where type='A1';
delete from templetdtl where type='A2';
insert into templetzone select 0,templetid,hometempletid,1,0,height,width,0,0,50,'#FFFFFF',255,bgimageid,0,10,'None',2,'#000000',50,'yyyy-MM-dd HH:mm',1,50,'',0,0,'',0 from templet where bgimageid>0 and hometempletid>0;
insert into templetzone select 0,templetid,templetid,1,0,height,width,0,0,50,'#FFFFFF',255,bgimageid,0,10,'None',2,'#000000',50,'yyyy-MM-dd HH:mm',1,50,'',0,0,'',0 from templet where bgimageid>0 and hometempletid=0;
insert into templetzone select 0,templetid,hometempletid,type,mainflag,height,width,topoffset,leftoffset,zindex,bgcolor,opacity,bgimageid,sleeptime,intervaltime,animation,speed,color,size,dateformat,fitflag,volume,touchlabel,touchtype,touchtempletid,'',templetdtlid from templetdtl;
insert into templetzonedtl select 0,bz.templetzoneid,mld.objtype,mld.objid,mld.sequence from medialist ml, medialistdtl mld, templetdtl bd, templetzone bz where bd.type!='7' and bd.objtype='1' and ml.medialistid=bd.objid and bd.templetdtlid=bz.oldid and ml.medialistid=mld.medialistid;

update templetdtl bd, templetzone bz set bz.type=14 where bd.type=6 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=15 where bd.type=4 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=16 where bd.type=5 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=6 where bd.type=3 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=5 where bd.type=2 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=4 where bd.type=1 and bd.direction=4 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=3 where bd.type=1 and bd.direction!=4 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=2 where bd.type=0 and bd.objtype=5 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=1 where bd.type=0 and bd.objtype=1 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.type=1 where bd.type=0 and bd.objtype=3 and bd.templetdtlid=bz.oldid;
update templetdtl bd, templetzone bz set bz.touchtype=6, bz.touchobjid=0, bz.content=bd.touchapk 
  where bd.touchtype='4' and bd.type='7' and bd.templetdtlid=bz.oldid;
update medialist ml, medialistdtl mld, templetdtl bd, templetzone bz
  set bz.touchtype='3', bz.touchobjid=mld.objid
  where bd.touchtype='3' and bd.type='7' and bd.objtype='1' 
  and mld.objtype='1' and ml.medialistid=bd.objid 
  and bd.templetdtlid=bz.oldid and ml.medialistid=mld.medialistid;
update medialist ml, medialistdtl mld, templetdtl bd, templetzone bz
  set bz.touchtype='4', bz.touchobjid=mld.objid
  where bd.touchtype='3' and bd.type='7' and bd.objtype='1' 
  and mld.objtype='2' and ml.medialistid=bd.objid 
  and bd.templetdtlid=bz.oldid and ml.medialistid=mld.medialistid;
update widget w, templetdtl bd, templetzone bz
  set bz.touchtype='5', bz.touchobjid=0, bz.content=w.url
  where bd.touchtype='3' and bd.type='7' and bd.objtype='5' 
  and w.widgetid=bd.objid and bd.templetdtlid=bz.oldid;
update widget w, templetdtl bd, templetzone bz
  set bz.content=w.url
  where bd.type='0' and bd.objtype='5' 
  and w.widgetid=bd.objid and bd.templetdtlid=bz.oldid;
update text t, templetdtl bd, templetzone bz
  set bz.content=t.text
  where bd.type='1' and bd.objtype='2' 
  and t.textid=bd.objid and bd.templetdtlid=bz.oldid;
update templetzone set zindex=50 where zindex=0;
update templetzone set zindex=51 where zindex=1;
update templetzone set zindex=52 where zindex=2;

delete from privilege where privilegeid > 0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.vsp','vsp.jsp','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(104,0,0,'menu.page','page.jsp','fa-html5',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(201,1,0,'menu.sdomain','sdomain.jsp','fa-desktop',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(202,1,0,'menu.org','org.jsp','fa-cloud',1,2);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(300,2,0,'menu.wizard','bundle/wizard.jsp','fa-hand-o-up',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(301,2,0,'menu.resource','','fa-qrcode',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.video','resource/video.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','resource/image.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','resource/audio.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30106,2,301,'menu.text','resource/text.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','resource/stream.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30108,2,301,'menu.dvb','resource/dvb.jsp','',1,8);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30109,2,301,'menu.widget','resource/widget.jsp','',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30110,2,301,'menu.rss','resource/rss.jsp','',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30111,2,301,'menu.diy','resource/diy.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30120,2,301,'menu.medialist','resource/medialist.jsp','',1,20);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30130,2,301,'楼盘','resource/house.jsp','',1,30);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30201,2,302,'menu.device','device/device.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30202,2,302,'menu.devicegroup','device/devicegroup.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30204,2,302,'menu.deviceconfig','device/deviceconfig.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30205,2,302,'menu.appfile','device/appfile.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30206,2,302,'menu.deviceversion','device/deviceversion.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30207,2,302,'menu.catalog','device/catalog.jsp','',1,7);

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

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.schedulemanage','','fa-calendar',1,6);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30500,2,305,'menu.bundleplan','plan/plan-bundle.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','plan/schedule-solo.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30502,2,305,'menu.pageplan','plan/plan-page.jsp','',1,2);

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

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(310,2,0,'menu.mrbm','','fa-cogs', '1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31001,2,310,'menu.location','meeting/location.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31003,2,310,'menu.equipment','meeting/equipment.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31002,2,310,'menu.meetingroom','meeting/meetingroom.jsp','','1',3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31004,2,310,'menu.meeting','meeting/meeting.jsp','','1',4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31005,2,310,'menu.meetingaudit','meeting/meetingaudit.jsp','','1',5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(311,2,0,'menu.vip','','fa-group','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31101,2,311,'menu.viproom','room/room.jsp','','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31102,2,311,'menu.viplist','person/person.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31103,2,311,'menu.vipevent','event/vipevent.jsp','','1',2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31104,2,311,'menu.vipattendance','event/vipattendance.jsp','','1',3);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(312,2,0,'menu.staffattendance','','fa-group','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31201,2,312,'menu.room2','room/room2.jsp','','1',0);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31202,2,312,'menu.staff2','person/person2.jsp','','1',1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(31203,2,312,'menu.event2','event/event2.jsp','','1',2);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
