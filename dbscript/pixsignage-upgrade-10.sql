############################################################
## pre script  #############################################
############################################################

set @version = 11;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-10.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table vsp add tagflag char(1) default '0';
alter table org add tags varchar(512) default '';
alter table org add tagflag char(1) default '0';
alter table branch add code varchar(16) default '';

alter table device add downloadspeed int default 0;
alter table device add downloadbytes bigint default 0;
alter table device add networkmode char(1) default '0';
alter table device add networksignal int default 0;
alter table device add brightness int default 0;
alter table device add tags varchar(512) default '';
alter table device add tagflag char(1) default '0';

alter table video add tags varchar(512) default '';
alter table mediagrid add tags varchar(512) default '';


CREATE TABLE `examinationroom`(
	`examinationroomid` int(11) NOT NULL  auto_increment COMMENT '考场id，自增主键' , 
	`name` varchar(200) COLLATE utf8_general_ci NOT NULL  COMMENT '考场名称' , 
	`description` varchar(3000) COLLATE utf8_general_ci NULL  COMMENT '补充说明部分' , 
	`starttime` datetime NOT NULL  COMMENT '开始时间' , 
	`endtime` datetime NOT NULL  COMMENT '结束时间' , 
	`coursename` varchar(200) COLLATE utf8_general_ci NULL  COMMENT '课程名' , 
	`courseid` int(11) NULL  COMMENT '课程id' , 
	`classroomid` int(11) NOT NULL  COMMENT '教室id' , 
	`orgid` int(11) NOT NULL  COMMENT '所属orgid' , 
	`createtime` datetime NOT NULL  COMMENT '创建时间' , 
	`createstaffid` int(11) NOT NULL  COMMENT '创建人员的id' , 
	PRIMARY KEY (`examinationroomid`) 
) ENGINE=InnoDB DEFAULT CHARSET='utf8';

insert into `privilege` (`privilegeid`, `subsystem`, `parentid`, `name`, `menuurl`, `icon`, `type`, `orgtype`, `sequence`, `createtime`) values('30731','2','307','menu.batchimport','classcardimport.jsp',NULL,'1','0','0','2017-07-25 09:50:30');
insert into `privilege` (`privilegeid`, `subsystem`, `parentid`, `name`, `menuurl`, `icon`, `type`, `orgtype`, `sequence`, `createtime`) values('30741','2','307','menu.examinationroom','examinationroom.jsp',NULL,'1','0','41','2017-08-02 12:29:30');


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
