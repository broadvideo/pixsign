############################################################
## pre script  #############################################
############################################################

set @version = 14;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-13.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

ALTER TABLE `courseschedule` 
	CHANGE `teachername` `teachername` varchar(500)  COLLATE utf8_general_ci NULL COMMENT '老师姓名' after `teacherid`, COMMENT='';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
