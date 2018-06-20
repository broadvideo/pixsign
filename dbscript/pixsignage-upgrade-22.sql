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

ALTER TABLE `meeting` 
	ADD COLUMN `periodmeetingid` int(11)   NOT NULL COMMENT '0:不存在   >0  关联周期会议id' after `uuid`, 
	ADD COLUMN `periodendtime` datetime   NULL COMMENT '周期结束日期 e.g. yyyy-MM-dd' after `endtime`, 
	ADD COLUMN `servicememo` varchar(2048)  COLLATE utf8_general_ci NULL COMMENT '后勤服务备注' after `amount`, 
	ADD COLUMN `periodflag` char(1)  COLLATE utf8_general_ci NOT NULL DEFAULT '0' COMMENT '周期会议事件 0：否  1：是' after `qrcode`, 
	ADD COLUMN `skipholidayflag` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期会议是否忽略节假日 0：否  1：是' after `periodflag`, 
	ADD COLUMN `periodtype` char(1)  COLLATE utf8_general_ci NULL COMMENT '周期类型  0：每天 1:工作日 2:每周 3：每个月' after `skipholidayflag`;


ALTER TABLE `person` 
	ADD COLUMN `branchid` int(11)   NULL COMMENT 'branchid' after `voiceprompt`;

UPDATE person p SET branchid=(SELECT branchid FROM branch b WHERE b.orgid=p.orgid  AND parentid=0)  WHERE STATUS='1' AND TYPE='2';

insert into privilege (privilegeid, subsystem, parentid, name, menuurl, icon, type, orgtype, sequence) values(31204,'2',312,'menu.personattendance','event/personattendance.jsp',NULL,'1','0','3');

ALTER TABLE `attendancelog` 
	ADD COLUMN `syncstatus` char(1)   NULL DEFAULT '0' COMMENT '同步标识，0:未同步 1：已同步 9：不需要同步' after `createtime`;
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('205','AttendanceServiceURL','AttendanceServiceURL','',NULL,'1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('206','CourseServiceURL','CourseServiceURL','',NULL,'1');

	
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('207','SafeCampusServer','SafeCampusServer','',NULL,'1');

CREATE TABLE `smartbox`(
	`smartboxid` INT(11) NOT NULL  AUTO_INCREMENT , 
	`orgid` INT(11) NOT NULL  , 
	`terminalid` VARCHAR(32)   NOT NULL  COMMENT '终端id' , 
	`name` VARCHAR(256)   NOT NULL  COMMENT '名称' , 
	`description` VARCHAR(2048)   NULL  , 
	`doorversion` VARCHAR(1)   NOT NULL  COMMENT '1:双柜门  2：新式收货机' , 
	`stocknum` INT(11) NULL  COMMENT '库存数' , 
	`extra` VARCHAR(1024)   NULL  COMMENT '上报额外数据' , 
	`createtime` TIMESTAMP NOT NULL  DEFAULT CURRENT_TIMESTAMP , 
	`status` CHAR(1)   NOT NULL  COMMENT '状态，0：无效 1：有效 9：删除' , 
	PRIMARY KEY (`smartboxid`) 
) ENGINE=INNODB DEFAULT CHARSET='utf8';

CREATE TABLE `smartboxlog`(
	`smartboxlogid` int(11) NOT NULL  auto_increment , 
	`smartboxid` int(11) NULL  , 
	`orgid` int(11) NOT NULL  , 
	`wxuserid` varchar(256)  NOT NULL  , 
	`terminalid` varchar(64)   NOT NULL  , 
	`wxmpid` varchar(256)   NOT NULL  , 
	`doorversion` char(1)   NULL  , 
	`doortype` char(1)   NULL  , 
	`stocknum` int(11) NULL  , 
	`extra` varchar(512)   NULL  , 
	`authorizeopentime` datetime NULL  , 
	`openstate` char(1)   NULL  , 
	`opentime` datetime NULL  , 
	`closestate` char(1)   NULL  , 
	`closetime` datetime NULL  , 
	`createtime` timestamp NOT NULL  DEFAULT CURRENT_TIMESTAMP , 
	PRIMARY KEY (`smartboxlogid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';



insert into `privilege` (`privilegeid`, `subsystem`, `parentid`, `name`, `menuurl`, `icon`, `type`, `orgtype`, `sequence`) values(313,'2',0,'menu.smartboxmanage',NULL,'fa-group','1','0','0');
insert into `privilege` (`privilegeid`, `subsystem`, `parentid`, `name`, `menuurl`, `icon`, `type`, `orgtype`, `sequence`) values(31301,'2',313,'menu.smartbox','/smartbox/smartbox.jsp',NULL,'1','0','1');

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
