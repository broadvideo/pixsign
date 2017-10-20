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

alter table branch add parentid2 int default 0;
alter table branch add parentid3 int default 0;
update branch set parentid2=0;
update branch set parentid3=0;
update branch b1, branch b2 set b1.parentid2=b2.parentid where b1.parentid=b2.branchid;
update branch b1, branch b2 set b1.parentid3=b2.parentid2 where b1.parentid=b2.branchid;

ALTER TABLE `courseschedule` 
	CHANGE `teachername` `teachername` varchar(500)  COLLATE utf8_general_ci NULL COMMENT '老师姓名' after `teacherid`, COMMENT='';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
