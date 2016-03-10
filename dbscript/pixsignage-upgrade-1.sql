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

update region set name='region.main' where regionid=1;
update region set name='region.text' where regionid=2;
update region set name='region.extra_1' where regionid=3;
update region set name='region.extra_2' where regionid=4;
update region set name='region.extra_3' where regionid=5;

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
