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

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
