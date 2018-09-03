############################################################
## pre script  #############################################
############################################################

set @version = 22;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-21.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;

############################################################
## upgrade script ##########################################
############################################################

alter table device add defaultbundleid int default 0;
update device d, schedule s, scheduledtl sd set d.defaultbundleid=sd.objid where d.deviceid=s.bindid and s.bindtype=1 and s.scheduleid=sd.scheduleid and sd.objtype=1;

alter table device add defaultpageid int default 0;
alter table device add hotspotflag char(1) default '0';
alter table device add hotspotssid varchar(32) default '';
alter table device add hotspotpassword varchar(32) default '';
alter table device add hotspotfrequency varchar(16) default '';

alter table org add mainpage varchar(32) default 'main.jsp';
alter table org add city varchar(64) default '';

alter table page add reviewflag char(1) default '1';
alter table page add comment varchar(1024) default '';
alter table page add json longtext;

alter table weather add unique key weather_unique_index1(city, type);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
