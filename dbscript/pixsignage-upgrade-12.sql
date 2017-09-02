############################################################
## pre script  #############################################
############################################################

set @version = 13;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-12.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

create table dailyplaylog( 
   dailyplaylogid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   deviceid int not null,
   mediatype char(1) not null,
   mediaid int not null,
   playdate date,
   total int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (dailyplaylogid)
 )engine = innodb
default character set utf8;
alter table dailyplaylog add index hourplaylog_index1(deviceid);
alter table dailyplaylog add index hourplaylog_index2(mediatype, mediaid);
alter table dailyplaylog add index hourplaylog_index3(orgid);
alter table dailyplaylog add unique index(deviceid, mediatype, mediaid, playdate);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
