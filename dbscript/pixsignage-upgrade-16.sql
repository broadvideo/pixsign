############################################################
## pre script  #############################################
############################################################

set @version = 17;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-16.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table templatezone add fixflag char(1) default '1';
alter table pagezone add fixflag char(1) default '1';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
