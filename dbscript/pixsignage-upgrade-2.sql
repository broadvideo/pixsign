############################################################
## pre script  #############################################
############################################################

set @version = 3;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-2.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table layoutdtl add sleeptime int default 0;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
