############################################################
## pre script  #############################################
############################################################

set @version = 2;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-1.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

insert into region(regionid,name,code,type) values(50,'region.stream_1','stream-1','6');
insert into region(regionid,name,code,type) values(51,'region.stream_2','stream-2','6');
insert into region(regionid,name,code,type) values(52,'region.stream_3','stream-3','6');
insert into region(regionid,name,code,type) values(53,'region.stream_4','stream-4','6');

alter table region modify type varchar(2) default '0';
insert into region(regionid,name,code,type) values(100,'region.a1','A1','A1');
insert into region(regionid,name,code,type) values(101,'region.a2','A2','A2');
update region set code='stream-1' where regionid=50;
update region set code='stream-2' where regionid=51;

alter table device add appname varchar(32) default '';
alter table device add mtype varchar(32) default '';

alter table device add iip varchar(32) default '';
alter table device modify appname varchar(128) default '';
alter table org add qrcodeflag char(1) default '0';

alter table vsp add maxdevices int;
alter table vsp add maxstorage bigint;
alter table vsp add currentdevices int default 0;
alter table vsp add currentstorage bigint default 0;
update vsp set maxdevices=100,maxstorage=10000 where code='default';

alter table staffrole add staffroleid int not null auto_increment, add primary key(staffroleid);
alter table staffprivilege add staffprivilegeid int not null auto_increment, add primary key(staffprivilegeid);
alter table roleprivilege add roleprivilegeid int not null auto_increment, add primary key(roleprivilegeid);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
