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

alter table layout add bgimageid int default 0;
alter table layoutdtl add bgimageid int default 0;
alter table layoutdtl add dateformat varchar(32);

alter table layoutdtl drop foreign key layoutdtl_ibfk_2;
alter table regionschedule drop foreign key regionschedule_ibfk_1;
delete from region;
insert into region(regionid,name,code,type) values(1,'region.main','main','0');
insert into region(regionid,name,code,type) values(2,'region.text_1','text-1','1');
insert into region(regionid,name,code,type) values(3,'region.text_2','text-2','1');
insert into region(regionid,name,code,type) values(4,'region.extra_1','extra-1','0');
insert into region(regionid,name,code,type) values(5,'region.extra_2','extra-2','0');
insert into region(regionid,name,code,type) values(6,'region.extra_3','extra-3','0');
insert into region(regionid,name,code,type) values(7,'region.extra_4','extra-4','0');
insert into region(regionid,name,code,type) values(8,'region.date_1','date-1','2');
insert into region(regionid,name,code,type) values(9,'region.date_2','date-2','2');

update layoutdtl set regionid=regionid+1 where regionid>2;
update regionschedule set regionid=regionid+1 where regionid>2;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
