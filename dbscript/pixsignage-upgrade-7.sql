############################################################
## pre script  #############################################
############################################################

set @version = 8;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-7.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table gridscheduledtl add duration int default 0;

alter table gridschedule add intervaltime int default 0;

create table schedule( 
   scheduleid int not null auto_increment,
   bindtype char(1) not null,
   bindid int not null,
   scheduletype char(1) not null,
   playmode char(1) not null,
   starttime time,
   endtime time,
   intervaltime int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (scheduleid)
 )engine = innodb
default character set utf8;
alter table schedule add index schedule_index1(bindtype, bindid);

create table scheduledtl( 
   scheduledtlid int not null auto_increment,
   scheduleid int not null,
   objtype char(1) not null,
   objid int not null,
   sequence int not null,
   duration int default 0,
   primary key (scheduledtlid)
 )engine = innodb
default character set utf8;
alter table scheduledtl add foreign key scheduledtl_fk1(scheduleid) references schedule(scheduleid);

insert into schedule(bindtype,bindid,scheduletype,playmode,starttime,endtime,intervaltime,createtime) select bindtype,bindid,'1',playmode,starttime,endtime,bundlescheduleid,createtime from bundleschedule order by bundlescheduleid;
insert into scheduledtl(scheduleid,objtype,objid,sequence,duration) select 1,'1',bundleid,sequence,bundlescheduleid from bundlescheduledtl order by bundlescheduledtlid;
update schedule s,scheduledtl sd set sd.scheduleid=s.scheduleid where s.intervaltime=sd.duration and s.scheduletype='1';

insert into schedule(bindtype,bindid,scheduletype,playmode,starttime,endtime,intervaltime,createtime) select '3',devicegridid,'2',playmode,starttime,endtime,gridscheduleid,createtime from gridschedule order by gridscheduleid;
insert into scheduledtl(scheduleid,objtype,objid,sequence,duration) select 1,'9',mediagridid,sequence,gridscheduleid from gridscheduledtl order by gridscheduledtlid;
update schedule s,scheduledtl sd set sd.scheduleid=s.scheduleid where s.intervaltime=sd.duration and s.scheduletype='2';

update schedule set intervaltime=0;
update scheduledtl set duration=0;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
