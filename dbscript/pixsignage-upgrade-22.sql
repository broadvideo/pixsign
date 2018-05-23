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

ALTER TABLE `event` 
	ADD COLUMN `type` char(1)  COLLATE utf8_general_ci NOT NULL COMMENT '类型，0:每天  1：工作日  2：自定义' after `name`, 
	ADD COLUMN `startdate` date   NOT NULL COMMENT '开始日期 yyyy-Mm-dd' after `type`, 
	ADD COLUMN `enddate` date   NOT NULL COMMENT '结束日期 yyyy-Mm-dd' after `startdate`, 
	ADD COLUMN `shortstarttime` time   NOT NULL COMMENT '开始时间HH:mm:ss' after `enddate`, 
	ADD COLUMN `shortendtime` time   NULL COMMENT '结束时间 HH:mm:ss' after `shortstarttime`, 
	ADD COLUMN `eventdaysflag` varchar(7)  COLLATE utf8_general_ci NOT NULL COMMENT '标记事件位，7位0/1表示，1111100 表示事件从周一到周五 ' after `endtime`;

/* Create table in target */
CREATE TABLE `eventdtl`(
	`eventdtlid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`eventid` int(11) NOT NULL  COMMENT '事件id' , 
	`dayofweek` int(11) NOT NULL  COMMENT '周几，1-7  1:周一  7:周末' , 
	`shortstarttime` time NOT NULL  COMMENT '开始时间:HH:mm:ss' , 
	`shortendtime` time NOT NULL  COMMENT '结束时间:HH:mm:ss' , 
	`createtime` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP  on update CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP COMMENT '创建时间' , 
	PRIMARY KEY (`eventdtlid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


/* Alter table in target */
ALTER TABLE `meeting` 
	ADD COLUMN `periodmeetingid` int(11)   NOT NULL COMMENT '0:不存在   >0  关联周期会议id' after `uuid`, 
	ADD COLUMN `periodendtime` datetime   NULL COMMENT '周期结束日期 e.g. yyyy-MM-dd' after `endtime`, 
	ADD COLUMN `servicememo` varchar(2048)  COLLATE utf8_general_ci NULL COMMENT '后勤服务备注' after `amount`, 
	ADD COLUMN `periodflag` char(1)  COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '周期会议事件 0：否  1：是' after `qrcode`, 
	ADD COLUMN `skipholidayflag` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期会议是否忽略节假日 0：否  1：是' after `periodflag`, 
	ADD COLUMN `periodtype` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期类型  0：每天 1:工作日 2:每周 3：每个月' after `skipholidayflag`;

/* Alter table in target */
ALTER TABLE `room` 
	ADD COLUMN `sourcetype` char(1)  COLLATE utf8_general_ci NULL DEFAULT '0' COMMENT '数据来源：0：内部录入 1：外部同步' after `description`, 
	ADD COLUMN `roompersonflag` char(1)  COLLATE utf8_general_ci NOT NULL COMMENT '关联人员：0：所有 1：自定义' after `sourcetype`, 
	DROP COLUMN `source_type`, COMMENT='';

/* Create table in target */
CREATE TABLE `roomperson`(
	`roompersonid` int(11) NOT NULL  auto_increment COMMENT '自增主键' , 
	`roomid` int(11) NOT NULL  COMMENT '分组id' , 
	`personid` int(11) NOT NULL  COMMENT '人员id' , 
	`createtime` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间' , 
	PRIMARY KEY (`roompersonid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';


/* Alter table in target */
ALTER TABLE `student` 
	CHANGE `hardid` `hardid` varchar(200)  COLLATE utf8_general_ci NULL COMMENT '硬件id' after `name`, COMMENT='';

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
