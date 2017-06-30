############################################################
## pre script  #############################################
############################################################

set @version = 10;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-9.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

drop table pagezone;
drop table page;
drop table layoutschedule;
drop table regionschedule;
drop table layoutdtl;
drop table layout;
drop table pagepkg;
drop table gridscheduledtl;
drop table gridschedule;
drop table region;

alter table vsp add bundleflag char(1) default '1';
alter table vsp add pageflag char(1) default '0';

alter table org add bundleflag char(1) default '1';
alter table org add pageflag char(1) default '0';

create table template( 
   templateid int not null auto_increment,
   uuid varchar(64) not null,
   orgid int not null,
   name varchar(64) not null,
   snapshot varchar(128),
   ratio char(1) default '1',
   height int not null,
   width int not null,
   publicflag char(1) default '0',
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (templateid)
 )engine = innodb
default character set utf8;

create table templatezone( 
   templatezoneid int not null auto_increment,
   templateid int not null,
   type tinyint not null,
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   transform varchar(128),
   bdcolor varchar(32) default '#000000',
   bdstyle varchar(128) default 'solid',
   bdwidth int default 0,
   bdtl int default 0,
   bdtr int default 0,
   bdbl int default 0,
   bdbr int default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   opacity int default 0,
   padding int default 0,
   shadowh int default 0,
   shadowv int default 0,
   shadowblur int default 0,
   shadowcolor varchar(8) default '#000000',
   color varchar(32) default '#000000',
   fontfamily varchar(32),
   fontsize int default 0,
   fontweight varchar(32),
   fontstyle varchar(32),
   decoration varchar(32),
   align varchar(32),
   lineheight int default 0,
   content longtext,
   objid varchar(1024),
   primary key (templatezoneid),
   foreign key (templateid) references template(templateid)
 )engine = innodb
default character set utf8;

create table page( 
   pageid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   templateid int default 0,
   name varchar(64) not null,
   snapshot varchar(128),
   ratio char(1) default '1',
   height int not null,
   width int not null,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   updatetime datetime,
   createstaffid int,
   primary key (pageid)
 )engine = innodb
default character set utf8;

create table pagezone( 
   pagezoneid int not null auto_increment,
   pageid int not null,
   type tinyint not null,
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   transform varchar(128),
   bdcolor varchar(32) default '#000000',
   bdstyle varchar(128) default 'solid',
   bdwidth int default 0,
   bdtl int default 0,
   bdtr int default 0,
   bdbl int default 0,
   bdbr int default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   opacity int default 0,
   padding int default 0,
   shadowh int default 0,
   shadowv int default 0,
   shadowblur int default 0,
   shadowcolor varchar(8) default '#000000',
   color varchar(32) default '#000000',
   fontfamily varchar(32),
   fontsize int default 0,
   fontweight varchar(32),
   fontstyle varchar(32),
   decoration varchar(32),
   align varchar(32),
   lineheight int default 0,
   content longtext,
   objid varchar(1024),
   primary key (pagezoneid),
   foreign key (pageid) references page(pageid)
 )engine = innodb
default character set utf8;

delete from privilege where privilegeid > 0;

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.opmanage','','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10101,0,101,'menu.vsp','vsp.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(201,1,0,'menu.org','org.jsp','fa-cloud',1,1);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(300,2,0,'menu.wizard','wizard.jsp','fa-hand-o-up',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(301,2,0,'menu.resource','','fa-qrcode',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.video','video.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','image.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','audio.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30106,2,301,'menu.text','text.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','stream.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30108,2,301,'menu.dvb','dvb.jsp','',1,8);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30109,2,301,'menu.widget','widget.jsp','',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30110,2,301,'menu.rss','rss.jsp','',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30120,2,301,'menu.medialist','medialist.jsp','',1,20);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30201,2,302,'menu.device','device.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30202,2,302,'menu.devicegroup','devicegroup.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30204,2,302,'menu.deviceconfig','deviceconfig.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30205,2,302,'menu.appfile','appfile.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30206,2,302,'menu.deviceversion','deviceversion.jsp','',1,6);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(303,2,0,'menu.bundlemanage','','fa-paw',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30301,2,303,'menu.bundle','bundle.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30302,2,303,'menu.touchbundle','bundle-touch.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30305,2,303,'menu.templet','templet.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30306,2,303,'menu.touchtemplet','templet-touch.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30309,2,303,'menu.bundlereview','bundle-review.jsp','',1,9);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(304,2,0,'menu.pagemanage','','fa-html5',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30401,2,304,'menu.page','page.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30405,2,304,'menu.template','template.jsp','',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.schedulemanage','','fa-calendar',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','schedule-solo.jsp','',1,1);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(306,2,0,'menu.mscreen','','fa-codepen',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30602,2,306,'menu.mediagrid','mediagrid.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30603,2,306,'menu.devicegrid','devicegrid.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30604,2,306,'menu.devicegridgroup','devicegridgroup.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30605,2,306,'menu.multiplan','plan-multi.jsp','',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(308,2,0,'menu.stat','','fa-bar-chart-o',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30801,2,308,'menu.onlinelog','onlinelog.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30802,2,308,'menu.playlog','playlog.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30811,2,308,'menu.oplog','oplog.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30821,2,308,'menu.pflowlog','pflowlog.jsp','',1,21);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30822,2,308,'menu.flowlog','flowlog.jsp','',1,22);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(309,2,0,'menu.systemmanage','','fa-cogs',1,99);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30901,2,309,'menu.staff','staff.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30902,2,309,'menu.role','role.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30903,2,309,'menu.branch','branch.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30909,2,309,'menu.config','config.jsp','',1,9);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
