############################################################
## pre script  #############################################
############################################################

set @version = 2;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-1.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

delete from privilege where privilegeid > 0;

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(101,1,0,'menu.opmanage','','fa-cloud',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10101,1,101,'menu.org','org.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(109,1,0,'menu.systemmanage','','fa-cogs',1,9,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10901,1,109,'menu.staff','staff.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10902,1,109,'menu.role','role.jsp','',1,2,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10909,1,109,'menu.config','config.jsp','',1,9,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10910,1,109,'menu.debug','crashreport.jsp','',1,10,'0');

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(301,2,0,'menu.wizard','wizard.jsp','fa-hand-o-up',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(201,2,0,'menu.resource','','fa-qrcode',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20101,2,201,'menu.medialist','medialist.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20102,2,201,'menu.intvideo','video-int.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20103,2,201,'menu.extvideo','video-ext.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20104,2,201,'menu.image','image.jsp','',1,4,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20105,2,201,'menu.text','text.jsp','',1,5,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20106,2,201,'menu.stream','stream.jsp','',1,6,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20107,2,201,'menu.dvb','dvb.jsp','',1,7,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20108,2,201,'menu.widget','widget.jsp','',1,8,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(202,2,0,'menu.devicemanage','','fa-desktop',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20201,2,202,'menu.device','device.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20202,2,202,'menu.devicegroup','devicegp.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20203,2,202,'menu.devicefile','devicefile.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(203,2,0,'menu.schedulemanage','','fa-calendar',1,4,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20301,2,203,'menu.layout','layout-design.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20302,2,203,'menu.layoutschedule','layout-schedule.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20303,2,203,'menu.regionschedule','region-schedule.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(204,2,0,'menu.vstation','','fa-video-camera',1,5,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20401,2,204,'menu.vchannel','vchannel.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20402,2,204,'menu.playlist','vchannel-playlist.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20403,2,204,'menu.vchannelschedule','vchannel-schedule.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(209,2,0,'menu.systemmanage','','fa-cogs',1,10,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20901,2,209,'menu.staff','staff.jsp','',1,1,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20902,2,209,'menu.role','role.jsp','',1,2,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20903,2,209,'menu.branch','branch.jsp','',1,3,'1');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(20909,2,209,'menu.config','config.jsp','',1,9,'1');

update region set name='region.main' where regionid=1;
update region set name='region.text' where regionid=2;
update region set name='region.extra_1' where regionid=3;
update region set name='region.extra_2' where regionid=4;
update region set name='region.extra_3' where regionid=5;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
