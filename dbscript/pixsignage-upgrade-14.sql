############################################################
## pre script  #############################################
############################################################

set @version = 15;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-14.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table org add maxdevices1 int default 0;
alter table org add maxdevices2 int default 0;
update org set maxdevices1=maxdevices;
update org set maxdevices2=maxdevices;

alter table pagezone add sourcetype char(1) default '0';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
