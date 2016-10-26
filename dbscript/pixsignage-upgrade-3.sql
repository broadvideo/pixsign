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

alter table layoutdtl add type varchar(2) default '0';
alter table layoutdtl add mainflag char(1) default '0';

alter table bundle add touchflag char(1) default '0';
alter table bundle add homeflag char(1) default '1';
alter table bundle add homebundleid int default 0;
alter table bundle add homeidletime int default 0;

alter table bundledtl add layoutdtlid int default 0;
alter table bundledtl add touchlabel varchar(128);
alter table bundledtl add touchtype char(1) default '0';
alter table bundledtl add touchbundleid int default 0;

update layoutdtl set mainflag=1 where regionid=1;
update layoutdtl ld, region r set ld.type=r.type where ld.regionid=r.regionid;

update bundle b, bundledtl bd, layoutdtl ld set bd.layoutdtlid=ld.layoutdtlid where b.bundleid=bd.bundleid and b.layoutid=ld.layoutid and bd.regionid=ld.regionid;

alter table layoutdtl drop regionid;
alter table bundledtl drop regionid;

delete from privilege where privilegeid >= 300;
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
