############################################################
## pre script  #############################################
############################################################

set @version = 12;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-11.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table video add oname varchar(64) default '';
alter table image add oname varchar(64) default '';

create table devicefilehis( 
   devicefilehisid int not null auto_increment,
   deviceid int not null,
   objtype char(1) not null,
   objid int not null,
   size bigint,
   createtime timestamp not null default current_timestamp,
   primary key (devicefilehisid),
   foreign key (deviceid) references device(deviceid)
 )engine = innodb
default character set utf8;
alter table devicefilehis add foreign key devicefilehis_fk1(deviceid) references device(deviceid);
alter table devicefilehis add index devicefilehis_index1(objtype, objid);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
