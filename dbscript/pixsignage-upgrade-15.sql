############################################################
## pre script  #############################################
############################################################

set @version = 16;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-15.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table page add privilegeflag char(1) default '0';

create table staffpage( 
   staffid int not null,
   pageid int not null
 )engine = innodb
default character set utf8;
alter table staffpage add unique(staffid,pageid);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
