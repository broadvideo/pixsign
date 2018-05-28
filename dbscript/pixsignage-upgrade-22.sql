############################################################
## pre script  #############################################
############################################################

set @version = 23;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-22.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;

############################################################
## upgrade script ##########################################
############################################################

alter table bundle add exportflag char(1) default 0;
alter table bundle add exportsize bigint default 0;

alter table page add exportflag char(1) default 0;
alter table page add exportsize bigint default 0;


/* Alter table in target */
ALTER TABLE `meeting` 
	ADD COLUMN `periodmeetingid` int(11)   NOT NULL COMMENT '0:不存在   >0  关联周期会议id' after `uuid`, 
	ADD COLUMN `periodendtime` datetime   NULL COMMENT '周期结束日期 e.g. yyyy-MM-dd' after `endtime`, 
	ADD COLUMN `servicememo` varchar(2048)  COLLATE utf8_general_ci NULL COMMENT '后勤服务备注' after `amount`, 
	ADD COLUMN `periodflag` char(1)  COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '周期会议事件 0：否  1：是' after `qrcode`, 
	ADD COLUMN `skipholidayflag` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期会议是否忽略节假日 0：否  1：是' after `periodflag`, 
	ADD COLUMN `periodtype` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期类型  0：每天 1:工作日 2:每周 3：每个月' after `skipholidayflag`;
ALTER TABLE `person` 
	ADD COLUMN `branchid` int(11)   NULL COMMENT 'branchid' after `voiceprompt`;



############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
