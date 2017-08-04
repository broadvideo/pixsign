############################################################
## pre script  #############################################
############################################################

set @version = 11;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-10.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table device add downloadspeed int default 0;
alter table device add downloadbytes bigint default 0;
alter table device add networkmode char(1) default '0';
alter table device add networksignal int default 0;
alter table device add brightness int default 0;
alter table device add tags varchar(512) default '';

alter table video add tags varchar(512) default '';
alter table org add tags varchar(512) default '';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
