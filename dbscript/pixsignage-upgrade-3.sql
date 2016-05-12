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

alter table org add powerflag char(1) default '0';
alter table org add poweron time;
alter table org add poweroff time;
alter table org add devicepass varchar(32) default '123456';

alter table video modify filename varchar(128);
alter table image modify filename varchar(128);

alter table layout add bgimageid int default 0;
alter table layoutdtl add bgimageid int default 0;
alter table layoutdtl add dateformat varchar(32);
alter table layoutdtl add fitflag char(1) default 1;
alter table layoutdtl add volume int default 50;

alter table layoutdtl drop foreign key layoutdtl_ibfk_2;
alter table regionschedule drop foreign key regionschedule_ibfk_1;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
