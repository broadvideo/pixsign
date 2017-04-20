############################################################
## pre script  #############################################
############################################################

set @version = 5;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-4.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table device add other varchar(128) default '';

alter table staff add sourcetype char(1) default '1';
alter table staff add sourceid varchar(32) default '';

alter table image add relateid int default 0;

create table audio( 
   audioid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(256) not null,
   filepath varchar(32),
   filename varchar(128),
   size bigint,
   md5 varchar(64),
   status char(1) default '1',
   description varchar(1024),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (audioid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
