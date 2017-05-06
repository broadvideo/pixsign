############################################################
## pre script  #############################################
############################################################

set @version = 8;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-7.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table gridscheduledtl add duration int default 0;

alter table gridschedule add intervaltime int default 0;

alter table devicegroup add type char(1) default '1';
alter table devicegroup add gridlayoutcode varchar(32);
alter table devicegroup add xcount int default 1;
alter table devicegroup add ycount int default 1;
alter table devicegroup add ratio char(1) default '1';
alter table devicegroup add width int default 0;
alter table devicegroup add height int default 0;

alter table devicegrid add snapshot varchar(128);
alter table devicegrid add devicegroupid int default 0;

alter table vsp add flowrateflag char(1) default '0';
alter table org add sscreenflag char(1) default '1';
alter table org add flowrateflag char(1) default '0';

update config set type = '1';
insert into config(configid, code, name, value, refer, type) values(1, 'SystemID', 'system.id', '', '', '0');
insert into config(configid, code, name, value, refer, type) values(2, 'APPVersion', 'app.version', '', '', '0');
insert into config(configid, code, name, value, refer, type) values(3, 'Copyright', 'system.copyright', 'Powered by BroadVideo', '', '0');
insert into config(configid, code, name, value, refer, type) values(4, 'ICP', 'system.icp', '', '', '0');

create table schedule( 
   scheduleid int not null auto_increment,
   bindtype char(1) not null,
   bindid int not null,
   scheduletype char(1) not null,
   playmode char(1) not null,
   starttime time,
   endtime time,
   intervaltime int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (scheduleid)
 )engine = innodb
default character set utf8;
alter table schedule add index schedule_index1(bindtype, bindid);

create table scheduledtl( 
   scheduledtlid int not null auto_increment,
   scheduleid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   duration int default 0,
   primary key (scheduledtlid)
 )engine = innodb
default character set utf8;
alter table scheduledtl add foreign key scheduledtl_fk1(scheduleid) references schedule(scheduleid);

insert into schedule(bindtype,bindid,scheduletype,playmode,starttime,endtime,intervaltime,createtime) select bindtype,bindid,'1',playmode,starttime,endtime,bundlescheduleid,createtime from bundleschedule order by bundlescheduleid;
insert into scheduledtl(scheduleid,objtype,objid,sequence,duration) select 1,'1',bundleid,sequence,bundlescheduleid from bundlescheduledtl order by bundlescheduledtlid;
update schedule s,scheduledtl sd set sd.scheduleid=s.scheduleid where s.intervaltime=sd.duration and s.scheduletype='1';

insert into schedule(bindtype,bindid,scheduletype,playmode,starttime,endtime,intervaltime,createtime) select '3',devicegridid,'2',playmode,starttime,endtime,gridscheduleid,createtime from gridschedule order by gridscheduleid;
insert into scheduledtl(scheduleid,objtype,objid,sequence,duration) select 1,'9',mediagridid,sequence,gridscheduleid from gridscheduledtl order by gridscheduledtlid;
update schedule s,scheduledtl sd set sd.scheduleid=s.scheduleid where s.intervaltime=sd.duration and s.scheduletype='2';

update schedule set intervaltime=0;
update scheduledtl set duration=0;

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
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30101,2,301,'menu.medialist','medialist.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.intvideo','video-int.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','image.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','audio.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30106,2,301,'menu.text','text.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','stream.jsp','',1,7);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30108,2,301,'menu.dvb','dvb.jsp','',1,8);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30109,2,301,'menu.widget','widget.jsp','',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30110,2,301,'menu.rss','rss.jsp','',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30201,2,302,'menu.device','device.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30202,2,302,'menu.devicegroup','devicegroup.jsp','',1,2);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30203,2,302,'menu.devicefile','devicefile.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30204,2,302,'menu.deviceconfig','deviceconfig.jsp','',1,4);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(303,2,0,'menu.schedulemanage','','fa-calendar',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30302,2,303,'menu.bundle','bundle.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30303,2,303,'menu.touchbundle','bundle-touch.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30304,2,303,'menu.schedule','schedule-solo.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30306,2,303,'menu.templet','templet.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30307,2,303,'menu.touchtemplet','templet-touch.jsp','',1,7);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.review','','fa-eye',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.bundlereview','bundle-review.jsp','',1,1);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(306,2,0,'menu.mscreen','','fa-codepen',1,7);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30601,2,306,'menu.page','page.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30602,2,306,'menu.mediagrid','mediagrid.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30603,2,306,'menu.devicegrid','devicegrid.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30604,2,306,'menu.devicegridgroup','devicegridgroup.jsp','',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30605,2,306,'menu.gridschedule','schedule-multi.jsp','',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(308,2,0,'menu.stat','','fa-bar-chart-o',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30801,2,308,'menu.onlinelog','onlinelog.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30802,2,308,'menu.playlog','playlog.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30811,2,308,'menu.oplog','oplog.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30821,2,308,'menu.pflowlog','pflowlog.jsp','',1,21);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30822,2,308,'menu.flowlog','flowlog.jsp','',1,22);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(309,2,0,'menu.systemmanage','','fa-cogs',1,10);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30901,2,309,'menu.staff','staff.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30902,2,309,'menu.role','role.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30903,2,309,'menu.branch','branch.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30909,2,309,'menu.config','config.jsp','',1,9);


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
