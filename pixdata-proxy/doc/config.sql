/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.6.26-log 
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('1','SystemID','system.id','1fc51a975d644ae0b38c2947c99d2efb','','0');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('2','APPVersion','app.version','2.3.0','','0');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('3','Copyright','system.copyright','Powered by BroadVideo','','0');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('4','ICP','system.icp','','','0');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('101','ServerIP','config.server.ip','192.168.0.102','','1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('102','ServerPort','config.server.port','80','','1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('201','PixedxIP','config.pixedx.ip','192.168.0.102','','1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('202','PixedxPort','config.pixedx.port','80','','1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('203','RunEnv','run.env','development',NULL,'1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('204','CmsSwipeConnStr','cmsswipe.connstr','jdbc:sqlserver://localhost:1433;databaseName=AxiomLog;user=sa;password=111111;',NULL,'1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('205','AttendanceServiceURL','AttendanceServiceURL','http://10.66.160.200:8088/ClassPlate',NULL,'1');
insert into `config` (`configid`, `code`, `name`, `value`, `refer`, `type`) values('206','CourseServiceURL','CourseServiceURL','http://10.66.160.200:81/big-data/viewQueryDetailWS?wsdl',NULL,'1');
