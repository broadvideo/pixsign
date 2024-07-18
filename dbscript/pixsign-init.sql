############################################################
## pre script  #############################################
############################################################

set @version = 1;
set @module = 'pixsign';
set @dbscript=concat(@module,'-init.sql');

DROP TABLE IF EXISTS `dbversion`;
CREATE TABLE `dbversion`  (
  `dbversionid` int(11) NOT NULL AUTO_INCREMENT,
  `version` int(11) NOT NULL,
  `dbscript` varchar(64) NOT NULL,
  `type` char(1) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT '0',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`dbversionid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

insert into dbversion(version,dbscript,type,status) values(0,'','0','1');
insert into dbversion(version,dbscript,type,status) values(@version,@dbscript,'1','0');
select last_insert_id() into @dbversionid;


############################################################
## create table ############################################
############################################################

CREATE TABLE `app`  (
  `appid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `mtype` varchar(32) NOT NULL,
  `sname` varchar(64) NULL DEFAULT '',
  `description` varchar(512) NULL DEFAULT '',
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`appid`),
  UNIQUE INDEX `app_index1`(`name`, `mtype`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `appfile`  (
  `appfileid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NULL DEFAULT NULL,
  `vname` varchar(32) NULL DEFAULT NULL,
  `vcode` int(11) NULL DEFAULT NULL,
  `mtype` varchar(32) NULL DEFAULT NULL,
  `latestflag` char(1) NULL DEFAULT '0',
  `filepath` varchar(128) NULL DEFAULT NULL,
  `filename` varchar(128) NULL DEFAULT NULL,
  `size` bigint(20) NULL DEFAULT NULL,
  `md5` varchar(64) NULL DEFAULT NULL,
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`appfileid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `config`  (
  `configid` int(11) NOT NULL,
  `code` varchar(32) NOT NULL,
  `name` varchar(64) NOT NULL,
  `value` varchar(1024) NULL DEFAULT NULL,
  `refer` varchar(1024) NULL DEFAULT NULL,
  `type` char(1) NULL DEFAULT NULL,
  PRIMARY KEY (`configid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `vsp`  (
  `vspid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `code` varchar(16) NOT NULL,
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `maxdevices` int(11) NULL DEFAULT NULL,
  `maxstorage` bigint(20) NULL DEFAULT NULL,
  `currentdevices` int(11) NULL DEFAULT 0,
  `currentstorage` bigint(20) NULL DEFAULT 0,
  `apps` varchar(128) NULL DEFAULT NULL,
  `feature` varchar(40) NULL DEFAULT '1010000000000000000000000000000000000000',
  `type` char(1) NULL DEFAULT '1',
  PRIMARY KEY (`vspid`)
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;
 
CREATE TABLE `org`  (
  `orgid` int(11) NOT NULL AUTO_INCREMENT,
  `vspid` int(11) NOT NULL,
  `topbranchid` int(11) NULL DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `code` varchar(16) NOT NULL,
  `status` char(1) NULL DEFAULT '1',
  `orgtype` char(1) NULL DEFAULT '1',
  `expireflag` char(1) NULL DEFAULT '0',
  `expiretime` datetime(0) NULL DEFAULT NULL,
  `maxdevices` int(11) NULL DEFAULT NULL,
  `maxstorage` bigint(20) NULL DEFAULT NULL,
  `currentdevices` int(11) NULL DEFAULT 0,
  `currentstorage` bigint(20) NULL DEFAULT 0,
  `currentdeviceidx` int(11) NULL DEFAULT 0,
  `copyright` varchar(512) NULL DEFAULT NULL,
  `description` varchar(512) NULL DEFAULT NULL,
  `backupvideoid` int(11) NULL DEFAULT NULL,
  `powerflag` char(1) NULL DEFAULT '0',
  `poweron` time(0) NULL DEFAULT NULL,
  `poweroff` time(0) NULL DEFAULT NULL,
  `devicepass` varchar(32) NULL DEFAULT '123456',
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `qrcodeflag` char(1) NULL DEFAULT '0',
  `apps` varchar(128) NULL DEFAULT NULL,
  `devicepassflag` char(1) NULL DEFAULT '1',
  `upgradeflag` char(1) NULL DEFAULT '0',
  `maxmdevices` int(11) NULL DEFAULT 0,
  `currentmdevices` int(11) NULL DEFAULT 0,
  `currentmdeviceidx` int(11) NULL DEFAULT 0,
  `logo` varchar(128) NULL DEFAULT '',
  `volumeflag` char(1) NULL DEFAULT '0',
  `volume` int(11) NULL DEFAULT 50,
  `timezone` varchar(64) NULL DEFAULT 'Asia/Shanghai',
  `tags` varchar(512) NULL DEFAULT '',
  `maxdevices1` int(11) NULL DEFAULT 0,
  `maxdevices2` int(11) NULL DEFAULT 0,
  `defaultbundleid` int(11) NULL DEFAULT 0,
  `defaultpageid` int(11) NULL DEFAULT 0,
  `feature` varchar(40) NULL DEFAULT '1100010000000000000010000000000000000000',
  `maxdetail` varchar(1024) NULL DEFAULT '',
  `mainpage` varchar(32) NULL DEFAULT 'main.jsp',
  `city` varchar(64) NULL DEFAULT '',
  `boardtype` varchar(512) NULL DEFAULT 'Common',
  `hightemperature` int(11) NULL DEFAULT 50,
  `lowtemperature` int(11) NULL DEFAULT 40,
  PRIMARY KEY (`orgid`),
  INDEX `vspid`(`vspid`),
  CONSTRAINT `org_ibfk_1` FOREIGN KEY (`vspid`) REFERENCES `vsp` (`vspid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
 
CREATE TABLE `branch`  (
  `branchid` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(32) NULL DEFAULT NULL COMMENT '全局唯一标识',
  `orgid` int(11) NOT NULL,
  `parentid` int(11) NULL DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `topfolderid` int(11) NULL DEFAULT NULL,
  `code` varchar(16) NULL DEFAULT '',
  `maxstorage` int(11) NULL DEFAULT 0,
  `currentstorage` int(11) NULL DEFAULT 0,
  `parentid2` int(11) NULL DEFAULT 0,
  `parentid3` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`branchid`),
  INDEX `orgid`(`orgid`),
  CONSTRAINT `branch_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
 
CREATE TABLE `staff`  (
  `staffid` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(32) NULL DEFAULT NULL COMMENT '全局唯一标识',
  `subsystem` char(1) NULL DEFAULT '1',
  `vspid` int(11) NULL DEFAULT NULL,
  `orgid` int(11) NULL DEFAULT NULL,
  `branchid` int(11) NULL DEFAULT NULL,
  `loginname` varchar(32) NOT NULL,
  `password` varchar(128) NULL DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `email` varchar(128) NULL DEFAULT NULL COMMENT '邮箱',
  `status` char(1) NULL DEFAULT '1',
  `token` varchar(128) NULL DEFAULT NULL,
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `loginflag` char(1) NULL DEFAULT '0',
  `logintime` datetime(0) NULL DEFAULT NULL,
  `sourcetype` char(1) NULL DEFAULT '1',
  `sourceid` varchar(32) NULL DEFAULT '',
  `phone` varchar(32) NULL DEFAULT '',
  PRIMARY KEY (`staffid`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;
 
CREATE TABLE `role`  (
  `roleid` int(11) NOT NULL AUTO_INCREMENT,
  `subsystem` char(1) NULL DEFAULT '1',
  `vspid` int(11) NULL DEFAULT NULL,
  `orgid` int(11) NULL DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`roleid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
 
CREATE TABLE `privilege`  (
  `privilegeid` int(11) NOT NULL,
  `subsystem` char(1) NULL DEFAULT NULL,
  `parentid` int(11) NULL DEFAULT NULL,
  `name` varchar(64) NULL DEFAULT NULL,
  `menuurl` varchar(512) NULL DEFAULT NULL,
  `icon` varchar(32) NULL DEFAULT NULL,
  `type` char(1) NULL DEFAULT '1',
  `orgtype` varchar(10) NULL DEFAULT '0',
  `sequence` int(11) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`privilegeid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `staffrole`  (
  `staffroleid` int(11) NOT NULL AUTO_INCREMENT,
  `staffid` int(11) NOT NULL,
  `roleid` int(11) NOT NULL,
  PRIMARY KEY (`staffroleid`),
  UNIQUE INDEX `staffid`(`staffid`, `roleid`),
  INDEX `roleid`(`roleid`),
  CONSTRAINT `staffrole_ibfk_1` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `staffrole_ibfk_2` FOREIGN KEY (`roleid`) REFERENCES `role` (`roleid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `staffprivilege`  (
  `staffprivilegeid` int(11) NOT NULL AUTO_INCREMENT,
  `staffid` int(11) NOT NULL,
  `privilegeid` int(11) NOT NULL,
  PRIMARY KEY (`staffprivilegeid`),
  UNIQUE INDEX `staffid`(`staffid`, `privilegeid`),
  CONSTRAINT `staffprivilege_ibfk_1` FOREIGN KEY (`staffid`) REFERENCES `staff` (`staffid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

CREATE TABLE `roleprivilege`  (
  `roleprivilegeid` int(11) NOT NULL AUTO_INCREMENT,
  `roleid` int(11) NOT NULL,
  `privilegeid` int(11) NOT NULL,
  PRIMARY KEY (`roleprivilegeid`),
  UNIQUE INDEX `roleid`(`roleid`, `privilegeid`),
  CONSTRAINT `roleprivilege_ibfk_1` FOREIGN KEY (`roleid`) REFERENCES `role` (`roleid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


CREATE TABLE `image`  (
  `imageid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `width` int(11) NULL DEFAULT 0,
  `height` int(11) NULL DEFAULT 0,
  `filepath` varchar(32) NULL DEFAULT NULL,
  `filename` varchar(128) NULL DEFAULT NULL,
  `size` bigint(20) NULL DEFAULT NULL,
  `md5` varchar(64) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT '1',
  `objtype` char(1) NOT NULL DEFAULT '0',
  `objid` int(11) NULL DEFAULT 0,
  `description` varchar(512) NULL DEFAULT NULL,
  `thumbnail` varchar(128) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `folderid` int(11) NULL DEFAULT NULL,
  `relateid` int(11) NULL DEFAULT 0,
  `uuid` varchar(64) NULL DEFAULT NULL,
  `oname` varchar(512) NULL DEFAULT NULL,
  `relateurl` varchar(512) NULL DEFAULT '',
  `relatetype` char(1) NULL DEFAULT '2',
  `adflag` char(1) NULL DEFAULT '0',
  PRIMARY KEY (`imageid`),
  INDEX `orgid`(`orgid`),
  INDEX `branchid`(`branchid`),
  CONSTRAINT `image_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `image_ibfk_2` FOREIGN KEY (`branchid`) REFERENCES `branch` (`branchid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `video`  (
  `videoid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `uuid` varchar(64) NOT NULL,
  `type` char(1) NULL DEFAULT '1',
  `width` int(11) NULL DEFAULT 0,
  `height` int(11) NULL DEFAULT 0,
  `filepath` varchar(32) NULL DEFAULT NULL,
  `filename` varchar(128) NULL DEFAULT NULL,
  `size` bigint(20) NULL DEFAULT NULL,
  `md5` varchar(64) NULL DEFAULT NULL,
  `previewflag` char(1) NULL DEFAULT '0',
  `status` char(1) NULL DEFAULT '1',
  `progress` int(11) NULL DEFAULT NULL,
  `description` varchar(1024) NULL DEFAULT NULL,
  `thumbnail` varchar(128) NULL DEFAULT NULL,
  `relateid` int(11) NULL DEFAULT 0,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `folderid` int(11) NULL DEFAULT NULL,
  `format` varchar(16) NULL DEFAULT '',
  `tags` varchar(512) NULL DEFAULT '',
  `oname` varchar(512) NULL DEFAULT NULL,
  `relateurl` varchar(512) NULL DEFAULT '',
  `duration` int(11) NULL DEFAULT 0,
  `adflag` char(1) NULL DEFAULT '0',
  `relatetype` char(1) NULL DEFAULT '2',
  PRIMARY KEY (`videoid`),
  INDEX `orgid`(`orgid`),
  INDEX `branchid`(`branchid`),
  CONSTRAINT `video_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `video_ibfk_2` FOREIGN KEY (`branchid`) REFERENCES `branch` (`branchid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `audio`  (
  `audioid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `filepath` varchar(32) NULL DEFAULT NULL,
  `filename` varchar(128) NULL DEFAULT NULL,
  `size` bigint(20) NULL DEFAULT NULL,
  `md5` varchar(64) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(1024) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`audioid`),
  INDEX `orgid`(`orgid`),
  INDEX `branchid`(`branchid`),
  CONSTRAINT `audio_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `audio_ibfk_2` FOREIGN KEY (`branchid`) REFERENCES `branch` (`branchid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `stream`  (
  `streamid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `url` varchar(1024) NOT NULL,
  `type` char(1) NULL DEFAULT '1',
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`streamid`),
  INDEX `orgid`(`orgid`),
  CONSTRAINT `stream_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `device`  (
  `deviceid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `terminalid` varchar(64) NOT NULL,
  `hardkey` varchar(64) NULL DEFAULT NULL,
  `name` varchar(64) NULL DEFAULT NULL,
  `position` varchar(512) NULL DEFAULT '',
  `ip` varchar(32) NULL DEFAULT NULL,
  `mac` varchar(32) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT '0',
  `description` varchar(512) NULL DEFAULT NULL,
  `onlineflag` char(1) NULL DEFAULT '0',
  `vname` varchar(32) NULL DEFAULT '',
  `type` varchar(2) NULL DEFAULT '0',
  `devicegroupid` int(11) NULL DEFAULT 0,
  `longitude` varchar(32) NULL DEFAULT '',
  `latitude` varchar(32) NULL DEFAULT '',
  `city` varchar(64) NULL DEFAULT NULL,
  `addr1` varchar(256) NULL DEFAULT '',
  `addr2` varchar(256) NULL DEFAULT '',
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `activetime` datetime(0) NULL DEFAULT NULL,
  `refreshtime` datetime(0) NULL DEFAULT NULL,
  `appname` varchar(128) NULL DEFAULT '',
  `mtype` varchar(32) NULL DEFAULT '',
  `iip` varchar(32) NULL DEFAULT '',
  `externalid` varchar(64) NULL DEFAULT '',
  `externalname` varchar(128) NULL DEFAULT '',
  `other` varchar(128) NULL DEFAULT '',
  `sign` varchar(64) NULL DEFAULT '',
  `vcode` int(11) NULL DEFAULT 0,
  `devicegridid` int(11) NULL DEFAULT 0,
  `xpos` int(11) NULL DEFAULT 0,
  `ypos` int(11) NULL DEFAULT 0,
  `ostype` char(1) NULL DEFAULT '1',
  `powerflag` tinyint(4) NULL DEFAULT 9,
  `poweron` time(0) NULL DEFAULT NULL,
  `poweroff` time(0) NULL DEFAULT NULL,
  `volumeflag` char(1) NULL DEFAULT '2',
  `volume` int(11) NULL DEFAULT 50,
  `boardinfo` varchar(512) NULL DEFAULT '',
  `storageused` bigint(20) NULL DEFAULT 0,
  `storageavail` bigint(20) NULL DEFAULT 0,
  `upgradeflag` char(1) NULL DEFAULT '0',
  `appfileid` int(11) NULL DEFAULT 0,
  `temperature` varchar(16) NULL DEFAULT '',
  `downloadspeed` int(11) NULL DEFAULT 0,
  `downloadbytes` bigint(20) NULL DEFAULT 0,
  `networkmode` char(1) NULL DEFAULT '0',
  `networksignal` int(11) NULL DEFAULT 0,
  `brightness` int(11) NULL DEFAULT 0,
  `tags` varchar(512) NULL DEFAULT '',
  `tagflag` char(1) NULL DEFAULT '0',
  `testflag` int(11) NULL DEFAULT 0,
  `cataitemid1` int(11) NULL DEFAULT 0,
  `cataitemid2` int(11) NULL DEFAULT 0,
  `interval1` int(11) NULL DEFAULT 60,
  `interval2` int(11) NULL DEFAULT 60,
  `defaultbundleid` int(11) NULL DEFAULT 0,
  `defaultpageid` int(11) NULL DEFAULT 0,
  `hotspotflag` char(1) NULL DEFAULT '0',
  `hotspotssid` varchar(32) NULL DEFAULT '',
  `hotspotpassword` varchar(32) NULL DEFAULT '',
  `hotspotfrequency` varchar(16) NULL DEFAULT '',
  `boardtype` varchar(32) NULL DEFAULT '',
  `temperatureflag` char(1) NULL DEFAULT '0',
  `relateid` int(11) NULL DEFAULT 0,
  `screenstatus` char(1) NULL DEFAULT '1',
  `batchid` int(11) NULL DEFAULT 0,
  `modelid` int(11) NULL DEFAULT 0,
  `qrcode` varchar(256) NULL DEFAULT '',
  `nextpoweron` bigint(20) NULL DEFAULT 0,
  `nextpoweroff` bigint(20) NULL DEFAULT 0,
  `playbundleid` int(11) NULL DEFAULT 0,
  `playpageid` int(11) NULL DEFAULT 0,
  `defaultmedialistid` int(11) NULL DEFAULT 0,
  `backupvideoid` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`deviceid`),
  UNIQUE INDEX `device_unique_index1`(`terminalid`),
  UNIQUE INDEX `device_unique_index2`(`hardkey`),
  INDEX `orgid`(`orgid`),
  INDEX `branchid`(`branchid`),
  CONSTRAINT `device_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `device_ibfk_2` FOREIGN KEY (`branchid`) REFERENCES `branch` (`branchid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `devicegroup`  (
  `devicegroupid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `type` char(1) NULL DEFAULT '1',
  `gridlayoutcode` varchar(32) NULL DEFAULT NULL,
  `xcount` int(11) NULL DEFAULT 1,
  `ycount` int(11) NULL DEFAULT 1,
  `ratio` char(1) NULL DEFAULT '1',
  `width` int(11) NULL DEFAULT 0,
  `height` int(11) NULL DEFAULT 0,
  `defaultbundleid` int(11) NULL DEFAULT 0,
  `defaultpageid` int(11) NULL DEFAULT 0,
  `externalid` varchar(8) NULL DEFAULT '',
  PRIMARY KEY (`devicegroupid`),
  INDEX `orgid`(`orgid`),
  INDEX `branchid`(`branchid`),
  CONSTRAINT `devicegroup_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `devicegroup_ibfk_2` FOREIGN KEY (`branchid`) REFERENCES `branch` (`branchid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `templet`  (
  `templetid` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(64) NOT NULL,
  `orgid` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `snapshot` varchar(128) NULL DEFAULT NULL,
  `ratio` char(1) NULL DEFAULT '1',
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `bgcolor` varchar(8) NULL DEFAULT '#000000',
  `bgimageid` int(11) NULL DEFAULT 0,
  `touchflag` char(1) NULL DEFAULT '0',
  `homeflag` char(1) NULL DEFAULT '1',
  `hometempletid` int(11) NULL DEFAULT 0,
  `homeidletime` int(11) NULL DEFAULT 0,
  `description` varchar(512) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT '1',
  `publicflag` char(1) NULL DEFAULT '0',
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`templetid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `templetzone`  (
  `templetzoneid` int(11) NOT NULL AUTO_INCREMENT,
  `templetid` int(11) NOT NULL,
  `hometempletid` int(11) NULL DEFAULT NULL,
  `type` tinyint(4) NOT NULL,
  `mainflag` char(1) NULL DEFAULT '0',
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `topoffset` int(11) NOT NULL,
  `leftoffset` int(11) NOT NULL,
  `zindex` int(11) NOT NULL DEFAULT 0,
  `bgcolor` varchar(32) NULL DEFAULT '#FFFFFF',
  `bgopacity` int(11) NULL DEFAULT 0,
  `bgimageid` int(11) NULL DEFAULT 0,
  `sleeptime` int(11) NULL DEFAULT 0,
  `intervaltime` int(11) NULL DEFAULT 10,
  `animation` varchar(32) NULL DEFAULT '',
  `speed` char(1) NULL DEFAULT '2',
  `color` varchar(32) NULL DEFAULT '#000000',
  `size` int(11) NULL DEFAULT 50,
  `dateformat` varchar(32) NULL DEFAULT '',
  `fitflag` char(1) NULL DEFAULT '1',
  `volume` int(11) NULL DEFAULT 50,
  `touchlabel` varchar(128) NULL DEFAULT '',
  `touchtype` char(1) NULL DEFAULT '9',
  `touchobjid` int(11) NULL DEFAULT 0,
  `content` longtext NULL,
  `oldid` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`templetzoneid`),
  INDEX `templetzone_ibfk_1`(`templetid`),
  CONSTRAINT `templetzone_ibfk_1` FOREIGN KEY (`templetid`) REFERENCES `templet` (`templetid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `templetzonedtl`  (
  `templetzonedtlid` int(11) NOT NULL AUTO_INCREMENT,
  `templetzoneid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`templetzonedtlid`),
  INDEX `templetzonedtl_ibfk_1`(`templetzoneid`),
  CONSTRAINT `templetzonedtl_ibfk_1` FOREIGN KEY (`templetzoneid`) REFERENCES `templetzone` (`templetzoneid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `bundle`  (
  `bundleid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `snapshot` varchar(128) NULL DEFAULT NULL,
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `status` char(1) NULL DEFAULT '1',
  `reviewflag` char(1) NULL DEFAULT '1',
  `comment` varchar(1024) NULL DEFAULT '',
  `json` longtext NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `touchflag` char(1) NULL DEFAULT '0',
  `homeflag` char(1) NULL DEFAULT '1',
  `homebundleid` int(11) NULL DEFAULT 0,
  `homeidletime` int(11) NULL DEFAULT 0,
  `templetid` int(11) NULL DEFAULT 0,
  `ratio` char(1) NULL DEFAULT '1',
  `bgcolor` varchar(8) NULL DEFAULT '#000000',
  `bgimageid` int(11) NULL DEFAULT 0,
  `description` varchar(512) NULL DEFAULT NULL,
  `uuid` varchar(64) NULL DEFAULT NULL,
  `updatetime` datetime(0) NULL DEFAULT NULL,
  `exportflag` char(1) NULL DEFAULT '0',
  `exportsize` bigint(20) NULL DEFAULT 0,
  `size` bigint(20) NULL DEFAULT 0,
  `md5` varchar(64) NULL DEFAULT '',
  `startdate` date NULL DEFAULT '1970-01-01',
  `enddate` date NULL DEFAULT '2037-01-01',
  PRIMARY KEY (`bundleid`),
  INDEX `orgid`(`orgid`),
  CONSTRAINT `bundle_ibfk_1` FOREIGN KEY (`orgid`) REFERENCES `org` (`orgid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `bundlezone`  (
  `bundlezoneid` int(11) NOT NULL AUTO_INCREMENT,
  `bundleid` int(11) NOT NULL,
  `homebundleid` int(11) NULL DEFAULT NULL,
  `type` tinyint(4) NOT NULL,
  `mainflag` char(1) NULL DEFAULT '0',
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `topoffset` int(11) NOT NULL,
  `leftoffset` int(11) NOT NULL,
  `zindex` int(11) NOT NULL DEFAULT 0,
  `bgcolor` varchar(32) NULL DEFAULT '#FFFFFF',
  `bgopacity` int(11) NULL DEFAULT 0,
  `bgimageid` int(11) NULL DEFAULT 0,
  `sleeptime` int(11) NULL DEFAULT 0,
  `intervaltime` int(11) NULL DEFAULT 10,
  `animation` varchar(32) NULL DEFAULT '',
  `speed` char(1) NULL DEFAULT '2',
  `color` varchar(32) NULL DEFAULT '#000000',
  `size` int(11) NULL DEFAULT 50,
  `dateformat` varchar(32) NULL DEFAULT '',
  `fitflag` char(1) NULL DEFAULT '1',
  `volume` int(11) NULL DEFAULT 50,
  `touchlabel` varchar(128) NULL DEFAULT '',
  `touchtype` char(1) NULL DEFAULT '9',
  `touchobjid` int(11) NULL DEFAULT 0,
  `content` longtext NULL,
  `oldid` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`bundlezoneid`),
  INDEX `bundlezone_ibfk_1`(`bundleid`),
  CONSTRAINT `bundlezone_ibfk_1` FOREIGN KEY (`bundleid`) REFERENCES `bundle` (`bundleid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `bundlezonedtl`  (
  `bundlezonedtlid` int(11) NOT NULL AUTO_INCREMENT,
  `bundlezoneid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`bundlezonedtlid`),
  INDEX `bundlezonedtl_ibfk_1`(`bundlezoneid`),
  CONSTRAINT `bundlezonedtl_ibfk_1` FOREIGN KEY (`bundlezoneid`) REFERENCES `bundlezone` (`bundlezoneid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `template`  (
  `templateid` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(64) NOT NULL,
  `orgid` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `snapshot` varchar(128) NULL DEFAULT NULL,
  `ratio` char(1) NULL DEFAULT '1',
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `touchflag` char(1) NULL DEFAULT '0',
  `homeflag` char(1) NULL DEFAULT '1',
  `hometemplateid` int(11) NULL DEFAULT NULL,
  `homeidletime` int(11) NULL DEFAULT 0,
  `publicflag` char(1) NULL DEFAULT '0',
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `limitflag` char(1) NULL DEFAULT '0',
  PRIMARY KEY (`templateid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `templatezone`  (
  `templatezoneid` int(11) NOT NULL AUTO_INCREMENT,
  `templateid` int(11) NOT NULL,
  `hometemplateid` int(11) NULL DEFAULT NULL,
  `type` tinyint(4) NOT NULL,
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `topoffset` int(11) NOT NULL,
  `leftoffset` int(11) NOT NULL,
  `zindex` int(11) NOT NULL DEFAULT 0,
  `transform` varchar(128) NULL DEFAULT NULL,
  `bdcolor` varchar(32) NULL DEFAULT '#000000',
  `bdstyle` varchar(128) NULL DEFAULT 'solid',
  `bdwidth` int(11) NULL DEFAULT 0,
  `bdradius` int(11) NULL DEFAULT 0,
  `bgcolor` varchar(32) NULL DEFAULT '#FFFFFF',
  `bgopacity` int(11) NULL DEFAULT 0,
  `opacity` int(11) NULL DEFAULT 0,
  `padding` int(11) NULL DEFAULT 0,
  `shadowh` int(11) NULL DEFAULT 0,
  `shadowv` int(11) NULL DEFAULT 0,
  `shadowblur` int(11) NULL DEFAULT 0,
  `shadowcolor` varchar(8) NULL DEFAULT '#000000',
  `color` varchar(32) NULL DEFAULT '#000000',
  `fontfamily` varchar(32) NULL DEFAULT NULL,
  `fontsize` int(11) NULL DEFAULT 0,
  `fontweight` varchar(32) NULL DEFAULT NULL,
  `fontstyle` varchar(32) NULL DEFAULT NULL,
  `decoration` varchar(32) NULL DEFAULT NULL,
  `align` varchar(32) NULL DEFAULT NULL,
  `lineheight` int(11) NULL DEFAULT 0,
  `rowss` int(11) NULL DEFAULT 1,
  `colss` int(11) NULL DEFAULT 1,
  `rules` varchar(32) NULL DEFAULT NULL,
  `rulecolor` varchar(32) NULL DEFAULT '#000000',
  `rulewidth` int(11) NULL DEFAULT 1,
  `dateformat` varchar(32) NULL DEFAULT '',
  `touchtype` char(1) NULL DEFAULT '0',
  `touchid` int(11) NULL DEFAULT 0,
  `content` longtext NULL,
  `animationinit` varchar(32) NULL DEFAULT 'none',
  `animationinitdelay` int(11) NULL DEFAULT 0,
  `animationclick` varchar(32) NULL DEFAULT 'none',
  `diyid` int(11) NULL DEFAULT 0,
  `diyactionid` int(11) NULL DEFAULT 0,
  `fixflag` char(1) NULL DEFAULT '1',
  `volume` int(11) NULL DEFAULT 50,
  `speed` int(11) NULL DEFAULT 5,
  `intervaltime` int(11) NULL DEFAULT 10,
  `effect` varchar(16) NULL DEFAULT 'slide',
  PRIMARY KEY (`templatezoneid`),
  INDEX `templatezone_ibfk_1`(`templateid`),
  CONSTRAINT `templatezone_ibfk_1` FOREIGN KEY (`templateid`) REFERENCES `template` (`templateid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `templatezonedtl`  (
  `templatezonedtlid` int(11) NOT NULL AUTO_INCREMENT,
  `templatezoneid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`templatezonedtlid`),
  INDEX `templatezonedtl_ibfk_1`(`templatezoneid`),
  CONSTRAINT `templatezonedtl_ibfk_1` FOREIGN KEY (`templatezoneid`) REFERENCES `templatezone` (`templatezoneid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `page`  (
  `pageid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `templateid` int(11) NULL DEFAULT 0,
  `name` varchar(64) NOT NULL,
  `snapshot` varchar(128) NULL DEFAULT NULL,
  `ratio` char(1) NULL DEFAULT '1',
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `touchflag` char(1) NULL DEFAULT '0',
  `homeflag` char(1) NULL DEFAULT '1',
  `homepageid` int(11) NULL DEFAULT NULL,
  `homeidletime` int(11) NULL DEFAULT 0,
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(512) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `updatetime` datetime(0) NULL DEFAULT NULL,
  `createstaffid` int(11) NULL DEFAULT NULL,
  `limitflag` char(1) NULL DEFAULT '0',
  `privilegeflag` char(1) NULL DEFAULT '0',
  `uuid` varchar(64) NULL DEFAULT '',
  `reviewflag` char(1) NULL DEFAULT '1',
  `comment` varchar(1024) NULL DEFAULT '',
  `json` longtext NULL,
  `exportflag` char(1) NULL DEFAULT '0',
  `exportsize` bigint(20) NULL DEFAULT 0,
  `size` bigint(20) NULL DEFAULT 0,
  `md5` varchar(64) NULL DEFAULT '',
  PRIMARY KEY (`pageid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `pagezone`  (
  `pagezoneid` int(11) NOT NULL AUTO_INCREMENT,
  `pageid` int(11) NOT NULL,
  `homepageid` int(11) NULL DEFAULT NULL,
  `type` tinyint(4) NOT NULL,
  `height` int(11) NOT NULL,
  `width` int(11) NOT NULL,
  `topoffset` int(11) NOT NULL,
  `leftoffset` int(11) NOT NULL,
  `zindex` int(11) NOT NULL DEFAULT 0,
  `transform` varchar(128) NULL DEFAULT NULL,
  `bdcolor` varchar(32) NULL DEFAULT '#000000',
  `bdstyle` varchar(128) NULL DEFAULT 'solid',
  `bdwidth` int(11) NULL DEFAULT 0,
  `bdradius` int(11) NULL DEFAULT 0,
  `bgcolor` varchar(32) NULL DEFAULT '#FFFFFF',
  `bgopacity` int(11) NULL DEFAULT 0,
  `opacity` int(11) NULL DEFAULT 0,
  `padding` int(11) NULL DEFAULT 0,
  `shadowh` int(11) NULL DEFAULT 0,
  `shadowv` int(11) NULL DEFAULT 0,
  `shadowblur` int(11) NULL DEFAULT 0,
  `shadowcolor` varchar(8) NULL DEFAULT '#000000',
  `color` varchar(32) NULL DEFAULT '#000000',
  `fontfamily` varchar(32) NULL DEFAULT NULL,
  `fontsize` int(11) NULL DEFAULT 0,
  `fontweight` varchar(32) NULL DEFAULT NULL,
  `fontstyle` varchar(32) NULL DEFAULT NULL,
  `decoration` varchar(32) NULL DEFAULT NULL,
  `align` varchar(32) NULL DEFAULT NULL,
  `lineheight` int(11) NULL DEFAULT 0,
  `rowss` int(11) NULL DEFAULT 1,
  `colss` int(11) NULL DEFAULT 1,
  `rules` varchar(32) NULL DEFAULT NULL,
  `rulecolor` varchar(32) NULL DEFAULT '#000000',
  `rulewidth` int(11) NULL DEFAULT 1,
  `dateformat` varchar(32) NULL DEFAULT '',
  `touchtype` char(1) NULL DEFAULT '0',
  `touchid` int(11) NULL DEFAULT 0,
  `content` longtext NULL,
  `animationinit` varchar(32) NULL DEFAULT 'none',
  `animationinitdelay` int(11) NULL DEFAULT 0,
  `animationclick` varchar(32) NULL DEFAULT 'none',
  `diyid` int(11) NULL DEFAULT 0,
  `diyactionid` int(11) NULL DEFAULT 0,
  `sourcetype` char(1) NULL DEFAULT '0',
  `fixflag` char(1) NULL DEFAULT '1',
  `volume` int(11) NULL DEFAULT 50,
  `speed` int(11) NULL DEFAULT 5,
  `intervaltime` int(11) NULL DEFAULT 10,
  `effect` varchar(16) NULL DEFAULT 'slide',
  PRIMARY KEY (`pagezoneid`),
  INDEX `pagezone_ibfk_1`(`pageid`),
  CONSTRAINT `pagezone_ibfk_1` FOREIGN KEY (`pageid`) REFERENCES `page` (`pageid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `pagezonedtl`  (
  `pagezonedtlid` int(11) NOT NULL AUTO_INCREMENT,
  `pagezoneid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  PRIMARY KEY (`pagezonedtlid`),
  INDEX `pagezonedtl_ibfk_1`(`pagezoneid`),
  CONSTRAINT `pagezonedtl_ibfk_1` FOREIGN KEY (`pagezoneid`) REFERENCES `pagezone` (`pagezoneid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `schedule`  (
  `scheduleid` int(11) NOT NULL AUTO_INCREMENT,
  `bindtype` char(1) NOT NULL,
  `bindid` int(11) NOT NULL,
  `scheduletype` char(1) NOT NULL,
  `playmode` char(1) NOT NULL,
  `starttime` time(0) NULL DEFAULT NULL,
  `endtime` time(0) NULL DEFAULT NULL,
  `intervaltime` int(11) NULL DEFAULT 0,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `attachflag` char(1) NULL DEFAULT '0',
  PRIMARY KEY (`scheduleid`),
  INDEX `schedule_index1`(`bindtype`, `bindid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `scheduledtl`  (
  `scheduledtlid` int(11) NOT NULL AUTO_INCREMENT,
  `scheduleid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  `duration` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`scheduledtlid`),
  INDEX `scheduledtl_fk1`(`scheduleid`),
  CONSTRAINT `scheduledtl_fk1` FOREIGN KEY (`scheduleid`) REFERENCES `schedule` (`scheduleid`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `plan`  (
  `planid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NULL DEFAULT NULL,
  `branchid` int(11) NULL DEFAULT NULL,
  `plantype` char(1) NOT NULL,
  `gridlayoutcode` varchar(32) NULL DEFAULT '',
  `priority` tinyint(4) NULL DEFAULT 0,
  `startdate` date NULL DEFAULT NULL,
  `enddate` date NULL DEFAULT NULL,
  `starttime` time(0) NULL DEFAULT NULL,
  `endtime` time(0) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`planid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `plandtl`  (
  `plandtlid` int(11) NOT NULL AUTO_INCREMENT,
  `planid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `sequence` int(11) NOT NULL,
  `duration` int(11) NULL DEFAULT 0,
  `maxtimes` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`plandtlid`),
  INDEX `plandtl_fk1`(`planid`),
  CONSTRAINT `plandtl_fk1` FOREIGN KEY (`planid`) REFERENCES `plan` (`planid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `planbind`  (
  `planbindid` int(11) NOT NULL AUTO_INCREMENT,
  `planid` int(11) NOT NULL,
  `bindtype` char(1) NOT NULL,
  `bindid` int(11) NOT NULL,
  PRIMARY KEY (`planbindid`),
  INDEX `planbind_index1`(`bindtype`, `bindid`),
  INDEX `planbind_fk1`(`planid`),
  CONSTRAINT `planbind_fk1` FOREIGN KEY (`planid`) REFERENCES `plan` (`planid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `devicefile`  (
  `devicefileid` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `size` bigint(20) NULL DEFAULT NULL,
  `progress` int(11) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT NULL,
  `description` varchar(1024) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `updatetime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`devicefileid`),
  INDEX `devicefile_index1`(`objtype`, `objid`),
  INDEX `devicefile_fk1`(`deviceid`),
  CONSTRAINT `devicefile_fk1` FOREIGN KEY (`deviceid`) REFERENCES `device` (`deviceid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `devicefilehis`  (
  `devicefilehisid` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` int(11) NOT NULL,
  `objtype` char(1) NOT NULL,
  `objid` int(11) NOT NULL,
  `size` bigint(20) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`devicefilehisid`),
  INDEX `devicefilehis_index1`(`objtype`, `objid`),
  INDEX `devicefilehis_fk1`(`deviceid`),
  CONSTRAINT `devicefilehis_fk1` FOREIGN KEY (`deviceid`) REFERENCES `device` (`deviceid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `msgevent`  (
  `msgeventid` int(11) NOT NULL AUTO_INCREMENT,
  `msgtype` char(2) NULL DEFAULT NULL,
  `objtype1` char(1) NULL DEFAULT NULL,
  `objid1` int(11) NULL DEFAULT NULL,
  `objtype2` char(1) NULL DEFAULT NULL,
  `objid2` int(11) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT NULL,
  `description` varchar(1024) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `sendtime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`msgeventid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `weather`  (
  `weatherid` int(11) NOT NULL AUTO_INCREMENT,
  `city` varchar(64) NOT NULL,
  `type` char(1) NOT NULL DEFAULT '1',
  `weather` longtext NULL,
  `status` char(1) NULL DEFAULT '1',
  `refreshtime` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`weatherid`),
  UNIQUE INDEX `weather_unique_index1`(`city`, `type`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `crashreport`  (
  `crashreportid` int(11) NOT NULL AUTO_INCREMENT,
  `hardkey` varchar(64) NULL DEFAULT NULL,
  `terminalid` varchar(64) NULL DEFAULT NULL,
  `clientip` varchar(32) NULL DEFAULT NULL,
  `clientname` varchar(64) NULL DEFAULT NULL,
  `os` varchar(64) NULL DEFAULT NULL,
  `appname` varchar(32) NULL DEFAULT NULL,
  `vname` varchar(32) NULL DEFAULT NULL,
  `vcode` varchar(32) NULL DEFAULT NULL,
  `stack` longtext NULL,
  `resolution` varchar(1024) NULL DEFAULT NULL,
  `other` varchar(1024) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`crashreportid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `debugreport`  (
  `debugreportid` int(11) NOT NULL AUTO_INCREMENT,
  `deviceid` int(11) NULL DEFAULT NULL,
  `hardkey` varchar(64) NULL DEFAULT NULL,
  `filepath` varchar(64) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`debugreportid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `sdomain`  (
  `sdomainid` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(128) NOT NULL,
  `code` varchar(32) NOT NULL,
  `langflag` char(1) NULL DEFAULT '0',
  `description` varchar(512) NULL DEFAULT NULL,
  `indexpage` varchar(128) NULL DEFAULT 'index.jsp',
  `theme` varchar(32) NULL DEFAULT 'darkblue',
  PRIMARY KEY (`sdomainid`),
  UNIQUE INDEX `code`(`code`),
  UNIQUE INDEX `sdomain_unique_index1`(`code`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `timezone`  (
  `timezoneid` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`timezoneid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `folder`  (
  `folderid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `parentid` int(11) NULL DEFAULT NULL,
  `name` varchar(64) NOT NULL,
  `status` char(1) NULL DEFAULT '1',
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `createstaffid` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`folderid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `onlinelog`  (
  `onlinelogid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `deviceid` int(11) NOT NULL,
  `onlinetime` datetime(0) NULL DEFAULT NULL,
  `offlinetime` datetime(0) NULL DEFAULT NULL,
  `duration` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`onlinelogid`),
  INDEX `onlinelog_index1`(`deviceid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `oplog`  (
  `oplogid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NOT NULL,
  `staffid` int(11) NOT NULL,
  `type` char(2) NULL DEFAULT NULL,
  `objtype1` char(1) NULL DEFAULT '',
  `objid1` int(11) NULL DEFAULT 0,
  `objname1` varchar(512) NULL DEFAULT NULL,
  `objtype2` char(1) NULL DEFAULT '',
  `objid2` int(11) NULL DEFAULT 0,
  `objname2` varchar(512) NULL DEFAULT NULL,
  `status` char(1) NULL DEFAULT '1',
  `description` varchar(1024) NULL DEFAULT NULL,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  PRIMARY KEY (`oplogid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `dailyplaylog`  (
  `dailyplaylogid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NULL DEFAULT 0,
  `deviceid` int(11) NOT NULL,
  `mediatype` char(1) NOT NULL,
  `mediaid` int(11) NOT NULL,
  `playdate` varchar(8) NULL DEFAULT NULL,
  `total` int(11) NULL DEFAULT 0,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `persons` int(11) NULL DEFAULT 0,
  `male` int(11) NULL DEFAULT 0,
  `female` int(11) NULL DEFAULT 0,
  `age1` int(11) NULL DEFAULT 0,
  `age2` int(11) NULL DEFAULT 0,
  `age3` int(11) NULL DEFAULT 0,
  `age4` int(11) NULL DEFAULT 0,
  `age5` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`dailyplaylogid`),
  UNIQUE INDEX `dailyplaylog_index4`(`deviceid`, `mediatype`, `mediaid`, `playdate`),
  INDEX `dailyplaylog_index1`(`deviceid`),
  INDEX `dailyplaylog_index2`(`mediatype`, `mediaid`),
  INDEX `dailyplaylog_index3`(`orgid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `monthlyplaylog`  (
  `monthlyplaylogid` int(11) NOT NULL AUTO_INCREMENT,
  `orgid` int(11) NOT NULL,
  `branchid` int(11) NULL DEFAULT 0,
  `deviceid` int(11) NOT NULL,
  `mediatype` char(1) NOT NULL,
  `mediaid` int(11) NOT NULL,
  `playmonth` varchar(6) NULL DEFAULT NULL,
  `total` int(11) NULL DEFAULT 0,
  `createtime` timestamp(0) NOT NULL DEFAULT current_timestamp,
  `persons` int(11) NULL DEFAULT 0,
  `male` int(11) NULL DEFAULT 0,
  `female` int(11) NULL DEFAULT 0,
  `age1` int(11) NULL DEFAULT 0,
  `age2` int(11) NULL DEFAULT 0,
  `age3` int(11) NULL DEFAULT 0,
  `age4` int(11) NULL DEFAULT 0,
  `age5` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`monthlyplaylogid`),
  UNIQUE INDEX `monthlyplaylog_index4`(`deviceid`, `mediatype`, `mediaid`, `playmonth`),
  INDEX `monthlyplaylog_index1`(`deviceid`),
  INDEX `monthlyplaylog_index2`(`mediatype`, `mediaid`),
  INDEX `monthlyplaylog_index3`(`orgid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;

CREATE TABLE `staffpage`  (
  `staffid` int(11) NOT NULL,
  `pageid` int(11) NOT NULL,
  UNIQUE INDEX `staffid`(`staffid`, `pageid`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;


############################################################
## init data  ##############################################
############################################################

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(0,'',0,'SUPER','','',2,1,'0');

insert into staff(subsystem,loginname,password,name) values(0,'root','965f91221572c93b065bff68ae291c50','root');
select last_insert_id() into @staffid1;
insert into staff(subsystem,loginname,password,name) values(0,'super','6b848c0a3a448dae8d480ac6902214bb','super');
select last_insert_id() into @staffid2;
insert into staff(subsystem,loginname,password,name) values(0,'admin','9c6e77902e2a6feca343509566af87ff','admin');
select last_insert_id() into @staffid3;
insert into staffprivilege(staffid,privilegeid) values(@staffid1,0);
insert into staffprivilege(staffid,privilegeid) values(@staffid2,0);
insert into staffprivilege(staffid,privilegeid) values(@staffid3,0);

insert into vsp(name,code,maxdevices,maxstorage,createstaffid) values('default','default',100,10000,@staffid1);
select last_insert_id() into @vspid;
insert into org(vspid,name,code,expireflag,expiretime,maxdevices,maxstorage,currentdeviceidx,description,createstaffid) values(@vspid,'default','default',0,'2037-01-01 00:00:00',0,0,0,'Default Org',@staffid2);
select last_insert_id() into @orgid;
insert into branch(orgid,parentid,name,description,createstaffid) values(@orgid,0,'super','Default Root Branch',@staffid3);
select last_insert_id() into @branchid;
update org set topbranchid=@branchid where orgid=@orgid;
insert into staff(subsystem,orgid,branchid,loginname,password,name) values(2,@orgid,@branchid,'admin@default','19c7b72b218c493c996536b57ab4b8c4','admin');

insert into folder(orgid,branchid,parentid,name) select orgid,branchid,0,'/' from branch where status!='9' order by branchid;
update branch b, folder f set b.topfolderid=f.folderid where b.branchid=f.branchid;

insert into config(configid, code, name, value, refer, type) values(101, 'ServerIP', 'config.server.ip', '127.0.0.1', '', '1');
insert into config(configid, code, name, value, refer, type) values(102, 'ServerPort', 'config.server.port', '80', '', '1');
insert into config(configid, code, name, value, refer, type) values(103, 'CDNServer', 'config.cdnserver', '', '', '1');
insert into config(configid, code, name, value, refer, type) values(1, 'SystemID', 'system.id', '', '', '0');
insert into config(configid, code, name, value, refer, type) values(2, 'APPVersion', 'app.version', '', '', '0');
insert into config(configid, code, name, value, refer, type) values(3, 'Copyright', 'system.copyright', 'Powered by BroadVideo', '', '0');
insert into config(configid, code, name, value, refer, type) values(4, 'ICP', 'system.icp', '', '', '0');

insert into sdomain(name, code) values('Digital Signage', 'default');

update org set maxdetail = concat(maxdevices1, ',', maxdevices1, ',', maxdevices1, ',', maxdevices1, ',', maxdevices1, ',', maxdevices2);

insert into timezone values(1, 'Africa/Abidjan');
insert into timezone values(2, 'Africa/Accra');
insert into timezone values(3, 'Africa/Addis_Ababa');
insert into timezone values(4, 'Africa/Algiers');
insert into timezone values(5, 'Africa/Asmara');
insert into timezone values(6, 'Africa/Asmera');
insert into timezone values(7, 'Africa/Bamako');
insert into timezone values(8, 'Africa/Bangui');
insert into timezone values(9, 'Africa/Banjul');
insert into timezone values(10, 'Africa/Bissau');
insert into timezone values(11, 'Africa/Blantyre');
insert into timezone values(12, 'Africa/Brazzaville');
insert into timezone values(13, 'Africa/Bujumbura');
insert into timezone values(14, 'Africa/Cairo');
insert into timezone values(15, 'Africa/Casablanca');
insert into timezone values(16, 'Africa/Ceuta');
insert into timezone values(17, 'Africa/Conakry');
insert into timezone values(18, 'Africa/Dakar');
insert into timezone values(19, 'Africa/Dar_es_Salaam');
insert into timezone values(20, 'Africa/Djibouti');
insert into timezone values(21, 'Africa/Douala');
insert into timezone values(22, 'Africa/El_Aaiun');
insert into timezone values(23, 'Africa/Freetown');
insert into timezone values(24, 'Africa/Gaborone');
insert into timezone values(25, 'Africa/Harare');
insert into timezone values(26, 'Africa/Johannesburg');
insert into timezone values(27, 'Africa/Juba');
insert into timezone values(28, 'Africa/Kampala');
insert into timezone values(29, 'Africa/Khartoum');
insert into timezone values(30, 'Africa/Kigali');
insert into timezone values(31, 'Africa/Kinshasa');
insert into timezone values(32, 'Africa/Lagos');
insert into timezone values(33, 'Africa/Libreville');
insert into timezone values(34, 'Africa/Lome');
insert into timezone values(35, 'Africa/Luanda');
insert into timezone values(36, 'Africa/Lubumbashi');
insert into timezone values(37, 'Africa/Lusaka');
insert into timezone values(38, 'Africa/Malabo');
insert into timezone values(39, 'Africa/Maputo');
insert into timezone values(40, 'Africa/Maseru');
insert into timezone values(41, 'Africa/Mbabane');
insert into timezone values(42, 'Africa/Mogadishu');
insert into timezone values(43, 'Africa/Monrovia');
insert into timezone values(44, 'Africa/Nairobi');
insert into timezone values(45, 'Africa/Ndjamena');
insert into timezone values(46, 'Africa/Niamey');
insert into timezone values(47, 'Africa/Nouakchott');
insert into timezone values(48, 'Africa/Ouagadougou');
insert into timezone values(49, 'Africa/Porto-Novo');
insert into timezone values(50, 'Africa/Sao_Tome');
insert into timezone values(51, 'Africa/Timbuktu');
insert into timezone values(52, 'Africa/Tripoli');
insert into timezone values(53, 'Africa/Tunis');
insert into timezone values(54, 'Africa/Windhoek');
insert into timezone values(55, 'America/Adak');
insert into timezone values(56, 'America/Anchorage');
insert into timezone values(57, 'America/Anguilla');
insert into timezone values(58, 'America/Antigua');
insert into timezone values(59, 'America/Araguaina');
insert into timezone values(60, 'America/Argentina/Buenos_Aires');
insert into timezone values(61, 'America/Argentina/Catamarca');
insert into timezone values(62, 'America/Argentina/ComodRivadavia');
insert into timezone values(63, 'America/Argentina/Cordoba');
insert into timezone values(64, 'America/Argentina/Jujuy');
insert into timezone values(65, 'America/Argentina/La_Rioja');
insert into timezone values(66, 'America/Argentina/Mendoza');
insert into timezone values(67, 'America/Argentina/Rio_Gallegos');
insert into timezone values(68, 'America/Argentina/Salta');
insert into timezone values(69, 'America/Argentina/San_Juan');
insert into timezone values(70, 'America/Argentina/San_Luis');
insert into timezone values(71, 'America/Argentina/Tucuman');
insert into timezone values(72, 'America/Argentina/Ushuaia');
insert into timezone values(73, 'America/Aruba');
insert into timezone values(74, 'America/Asuncion');
insert into timezone values(75, 'America/Atikokan');
insert into timezone values(76, 'America/Atka');
insert into timezone values(77, 'America/Bahia');
insert into timezone values(78, 'America/Bahia_Banderas');
insert into timezone values(79, 'America/Barbados');
insert into timezone values(80, 'America/Belem');
insert into timezone values(81, 'America/Belize');
insert into timezone values(82, 'America/Blanc-Sablon');
insert into timezone values(83, 'America/Boa_Vista');
insert into timezone values(84, 'America/Bogota');
insert into timezone values(85, 'America/Boise');
insert into timezone values(86, 'America/Buenos_Aires');
insert into timezone values(87, 'America/Cambridge_Bay');
insert into timezone values(88, 'America/Campo_Grande');
insert into timezone values(89, 'America/Cancun');
insert into timezone values(90, 'America/Caracas');
insert into timezone values(91, 'America/Catamarca');
insert into timezone values(92, 'America/Cayenne');
insert into timezone values(93, 'America/Cayman');
insert into timezone values(94, 'America/Chicago');
insert into timezone values(95, 'America/Chihuahua');
insert into timezone values(96, 'America/Coral_Harbour');
insert into timezone values(97, 'America/Cordoba');
insert into timezone values(98, 'America/Costa_Rica');
insert into timezone values(99, 'America/Creston');
insert into timezone values(100, 'America/Cuiaba');
insert into timezone values(101, 'America/Curacao');
insert into timezone values(102, 'America/Danmarkshavn');
insert into timezone values(103, 'America/Dawson');
insert into timezone values(104, 'America/Dawson_Creek');
insert into timezone values(105, 'America/Denver');
insert into timezone values(106, 'America/Detroit');
insert into timezone values(107, 'America/Dominica');
insert into timezone values(108, 'America/Edmonton');
insert into timezone values(109, 'America/Eirunepe');
insert into timezone values(110, 'America/El_Salvador');
insert into timezone values(111, 'America/Ensenada');
insert into timezone values(112, 'America/Fort_Wayne');
insert into timezone values(113, 'America/Fortaleza');
insert into timezone values(114, 'America/Glace_Bay');
insert into timezone values(115, 'America/Godthab');
insert into timezone values(116, 'America/Goose_Bay');
insert into timezone values(117, 'America/Grand_Turk');
insert into timezone values(118, 'America/Grenada');
insert into timezone values(119, 'America/Guadeloupe');
insert into timezone values(120, 'America/Guatemala');
insert into timezone values(121, 'America/Guayaquil');
insert into timezone values(122, 'America/Guyana');
insert into timezone values(123, 'America/Halifax');
insert into timezone values(124, 'America/Havana');
insert into timezone values(125, 'America/Hermosillo');
insert into timezone values(126, 'America/Indiana/Indianapolis');
insert into timezone values(127, 'America/Indiana/Knox');
insert into timezone values(128, 'America/Indiana/Marengo');
insert into timezone values(129, 'America/Indiana/Petersburg');
insert into timezone values(130, 'America/Indiana/Tell_City');
insert into timezone values(131, 'America/Indiana/Vevay');
insert into timezone values(132, 'America/Indiana/Vincennes');
insert into timezone values(133, 'America/Indiana/Winamac');
insert into timezone values(134, 'America/Indianapolis');
insert into timezone values(135, 'America/Inuvik');
insert into timezone values(136, 'America/Iqaluit');
insert into timezone values(137, 'America/Jamaica');
insert into timezone values(138, 'America/Jujuy');
insert into timezone values(139, 'America/Juneau');
insert into timezone values(140, 'America/Kentucky/Louisville');
insert into timezone values(141, 'America/Kentucky/Monticello');
insert into timezone values(142, 'America/Knox_IN');
insert into timezone values(143, 'America/Kralendijk');
insert into timezone values(144, 'America/La_Paz');
insert into timezone values(145, 'America/Lima');
insert into timezone values(146, 'America/Los_Angeles');
insert into timezone values(147, 'America/Louisville');
insert into timezone values(148, 'America/Lower_Princes');
insert into timezone values(149, 'America/Maceio');
insert into timezone values(150, 'America/Managua');
insert into timezone values(151, 'America/Manaus');
insert into timezone values(152, 'America/Marigot');
insert into timezone values(153, 'America/Martinique');
insert into timezone values(154, 'America/Matamoros');
insert into timezone values(155, 'America/Mazatlan');
insert into timezone values(156, 'America/Mendoza');
insert into timezone values(157, 'America/Menominee');
insert into timezone values(158, 'America/Merida');
insert into timezone values(159, 'America/Metlakatla');
insert into timezone values(160, 'America/Mexico_City');
insert into timezone values(161, 'America/Miquelon');
insert into timezone values(162, 'America/Moncton');
insert into timezone values(163, 'America/Monterrey');
insert into timezone values(164, 'America/Montevideo');
insert into timezone values(165, 'America/Montreal');
insert into timezone values(166, 'America/Montserrat');
insert into timezone values(167, 'America/Nassau');
insert into timezone values(168, 'America/New_York');
insert into timezone values(169, 'America/Nipigon');
insert into timezone values(170, 'America/Nome');
insert into timezone values(171, 'America/Noronha');
insert into timezone values(172, 'America/North_Dakota/Beulah');
insert into timezone values(173, 'America/North_Dakota/Center');
insert into timezone values(174, 'America/North_Dakota/New_Salem');
insert into timezone values(175, 'America/Ojinaga');
insert into timezone values(176, 'America/Panama');
insert into timezone values(177, 'America/Pangnirtung');
insert into timezone values(178, 'America/Paramaribo');
insert into timezone values(179, 'America/Phoenix');
insert into timezone values(180, 'America/Port-au-Prince');
insert into timezone values(181, 'America/Port_of_Spain');
insert into timezone values(182, 'America/Porto_Acre');
insert into timezone values(183, 'America/Porto_Velho');
insert into timezone values(184, 'America/Puerto_Rico');
insert into timezone values(185, 'America/Rainy_River');
insert into timezone values(186, 'America/Rankin_Inlet');
insert into timezone values(187, 'America/Recife');
insert into timezone values(188, 'America/Regina');
insert into timezone values(189, 'America/Resolute');
insert into timezone values(190, 'America/Rio_Branco');
insert into timezone values(191, 'America/Rosario');
insert into timezone values(192, 'America/Santa_Isabel');
insert into timezone values(193, 'America/Santarem');
insert into timezone values(194, 'America/Santiago');
insert into timezone values(195, 'America/Santo_Domingo');
insert into timezone values(196, 'America/Sao_Paulo');
insert into timezone values(197, 'America/Scoresbysund');
insert into timezone values(198, 'America/Shiprock');
insert into timezone values(199, 'America/Sitka');
insert into timezone values(200, 'America/St_Barthelemy');
insert into timezone values(201, 'America/St_Johns');
insert into timezone values(202, 'America/St_Kitts');
insert into timezone values(203, 'America/St_Lucia');
insert into timezone values(204, 'America/St_Thomas');
insert into timezone values(205, 'America/St_Vincent');
insert into timezone values(206, 'America/Swift_Current');
insert into timezone values(207, 'America/Tegucigalpa');
insert into timezone values(208, 'America/Thule');
insert into timezone values(209, 'America/Thunder_Bay');
insert into timezone values(210, 'America/Tijuana');
insert into timezone values(211, 'America/Toronto');
insert into timezone values(212, 'America/Tortola');
insert into timezone values(213, 'America/Vancouver');
insert into timezone values(214, 'America/Virgin');
insert into timezone values(215, 'America/Whitehorse');
insert into timezone values(216, 'America/Winnipeg');
insert into timezone values(217, 'America/Yakutat');
insert into timezone values(218, 'America/Yellowknife');
insert into timezone values(219, 'Antarctica/Casey');
insert into timezone values(220, 'Antarctica/Davis');
insert into timezone values(221, 'Antarctica/DumontDUrville');
insert into timezone values(222, 'Antarctica/Macquarie');
insert into timezone values(223, 'Antarctica/Mawson');
insert into timezone values(224, 'Antarctica/McMurdo');
insert into timezone values(225, 'Antarctica/Palmer');
insert into timezone values(226, 'Antarctica/Rothera');
insert into timezone values(227, 'Antarctica/South_Pole');
insert into timezone values(228, 'Antarctica/Syowa');
insert into timezone values(229, 'Antarctica/Vostok');
insert into timezone values(230, 'Arctic/Longyearbyen');
insert into timezone values(231, 'Asia/Aden');
insert into timezone values(232, 'Asia/Almaty');
insert into timezone values(233, 'Asia/Amman');
insert into timezone values(234, 'Asia/Anadyr');
insert into timezone values(235, 'Asia/Aqtau');
insert into timezone values(236, 'Asia/Aqtobe');
insert into timezone values(237, 'Asia/Ashgabat');
insert into timezone values(238, 'Asia/Ashkhabad');
insert into timezone values(239, 'Asia/Baghdad');
insert into timezone values(240, 'Asia/Bahrain');
insert into timezone values(241, 'Asia/Baku');
insert into timezone values(242, 'Asia/Bangkok');
insert into timezone values(243, 'Asia/Beirut');
insert into timezone values(244, 'Asia/Bishkek');
insert into timezone values(245, 'Asia/Brunei');
insert into timezone values(246, 'Asia/Calcutta');
insert into timezone values(247, 'Asia/Choibalsan');
insert into timezone values(248, 'Asia/Chongqing');
insert into timezone values(249, 'Asia/Chungking');
insert into timezone values(250, 'Asia/Colombo');
insert into timezone values(251, 'Asia/Dacca');
insert into timezone values(252, 'Asia/Damascus');
insert into timezone values(253, 'Asia/Dhaka');
insert into timezone values(254, 'Asia/Dili');
insert into timezone values(255, 'Asia/Dubai');
insert into timezone values(256, 'Asia/Dushanbe');
insert into timezone values(257, 'Asia/Gaza');
insert into timezone values(258, 'Asia/Harbin');
insert into timezone values(259, 'Asia/Hebron');
insert into timezone values(260, 'Asia/Ho_Chi_Minh');
insert into timezone values(261, 'Asia/Hong_Kong');
insert into timezone values(262, 'Asia/Hovd');
insert into timezone values(263, 'Asia/Irkutsk');
insert into timezone values(264, 'Asia/Istanbul');
insert into timezone values(265, 'Asia/Jakarta');
insert into timezone values(266, 'Asia/Jayapura');
insert into timezone values(267, 'Asia/Jerusalem');
insert into timezone values(268, 'Asia/Kabul');
insert into timezone values(269, 'Asia/Kamchatka');
insert into timezone values(270, 'Asia/Karachi');
insert into timezone values(271, 'Asia/Kashgar');
insert into timezone values(272, 'Asia/Kathmandu');
insert into timezone values(273, 'Asia/Katmandu');
insert into timezone values(274, 'Asia/Khandyga');
insert into timezone values(275, 'Asia/Kolkata');
insert into timezone values(276, 'Asia/Krasnoyarsk');
insert into timezone values(277, 'Asia/Kuala_Lumpur');
insert into timezone values(278, 'Asia/Kuching');
insert into timezone values(279, 'Asia/Kuwait');
insert into timezone values(280, 'Asia/Macao');
insert into timezone values(281, 'Asia/Macau');
insert into timezone values(282, 'Asia/Magadan');
insert into timezone values(283, 'Asia/Makassar');
insert into timezone values(284, 'Asia/Manila');
insert into timezone values(285, 'Asia/Muscat');
insert into timezone values(286, 'Asia/Nicosia');
insert into timezone values(287, 'Asia/Novokuznetsk');
insert into timezone values(288, 'Asia/Novosibirsk');
insert into timezone values(289, 'Asia/Omsk');
insert into timezone values(290, 'Asia/Oral');
insert into timezone values(291, 'Asia/Phnom_Penh');
insert into timezone values(292, 'Asia/Pontianak');
insert into timezone values(293, 'Asia/Pyongyang');
insert into timezone values(294, 'Asia/Qatar');
insert into timezone values(295, 'Asia/Qyzylorda');
insert into timezone values(296, 'Asia/Rangoon');
insert into timezone values(297, 'Asia/Riyadh');
insert into timezone values(298, 'Asia/Saigon');
insert into timezone values(299, 'Asia/Sakhalin');
insert into timezone values(300, 'Asia/Samarkand');
insert into timezone values(301, 'Asia/Seoul');
insert into timezone values(302, 'Asia/Shanghai');
insert into timezone values(303, 'Asia/Singapore');
insert into timezone values(304, 'Asia/Taipei');
insert into timezone values(305, 'Asia/Tashkent');
insert into timezone values(306, 'Asia/Tbilisi');
insert into timezone values(307, 'Asia/Tehran');
insert into timezone values(308, 'Asia/Tel_Aviv');
insert into timezone values(309, 'Asia/Thimbu');
insert into timezone values(310, 'Asia/Thimphu');
insert into timezone values(311, 'Asia/Tokyo');
insert into timezone values(312, 'Asia/Ujung_Pandang');
insert into timezone values(313, 'Asia/Ulaanbaatar');
insert into timezone values(314, 'Asia/Ulan_Bator');
insert into timezone values(315, 'Asia/Urumqi');
insert into timezone values(316, 'Asia/Ust-Nera');
insert into timezone values(317, 'Asia/Vientiane');
insert into timezone values(318, 'Asia/Vladivostok');
insert into timezone values(319, 'Asia/Yakutsk');
insert into timezone values(320, 'Asia/Yekaterinburg');
insert into timezone values(321, 'Asia/Yerevan');
insert into timezone values(322, 'Atlantic/Azores');
insert into timezone values(323, 'Atlantic/Bermuda');
insert into timezone values(324, 'Atlantic/Canary');
insert into timezone values(325, 'Atlantic/Cape_Verde');
insert into timezone values(326, 'Atlantic/Faeroe');
insert into timezone values(327, 'Atlantic/Faroe');
insert into timezone values(328, 'Atlantic/Jan_Mayen');
insert into timezone values(329, 'Atlantic/Madeira');
insert into timezone values(330, 'Atlantic/Reykjavik');
insert into timezone values(331, 'Atlantic/South_Georgia');
insert into timezone values(332, 'Atlantic/St_Helena');
insert into timezone values(333, 'Atlantic/Stanley');
insert into timezone values(334, 'Australia/ACT');
insert into timezone values(335, 'Australia/Adelaide');
insert into timezone values(336, 'Australia/Brisbane');
insert into timezone values(337, 'Australia/Broken_Hill');
insert into timezone values(338, 'Australia/Canberra');
insert into timezone values(339, 'Australia/Currie');
insert into timezone values(340, 'Australia/Darwin');
insert into timezone values(341, 'Australia/Eucla');
insert into timezone values(342, 'Australia/Hobart');
insert into timezone values(343, 'Australia/LHI');
insert into timezone values(344, 'Australia/Lindeman');
insert into timezone values(345, 'Australia/Lord_Howe');
insert into timezone values(346, 'Australia/Melbourne');
insert into timezone values(347, 'Australia/NSW');
insert into timezone values(348, 'Australia/North');
insert into timezone values(349, 'Australia/Perth');
insert into timezone values(350, 'Australia/Queensland');
insert into timezone values(351, 'Australia/South');
insert into timezone values(352, 'Australia/Sydney');
insert into timezone values(353, 'Australia/Tasmania');
insert into timezone values(354, 'Australia/Victoria');
insert into timezone values(355, 'Australia/West');
insert into timezone values(356, 'Australia/Yancowinna');
insert into timezone values(357, 'Brazil/Acre');
insert into timezone values(358, 'Brazil/DeNoronha');
insert into timezone values(359, 'Brazil/East');
insert into timezone values(360, 'Brazil/West');
insert into timezone values(361, 'CET');
insert into timezone values(362, 'CST6CDT');
insert into timezone values(363, 'Canada/Atlantic');
insert into timezone values(364, 'Canada/Central');
insert into timezone values(365, 'Canada/East-Saskatchewan');
insert into timezone values(366, 'Canada/Eastern');
insert into timezone values(367, 'Canada/Mountain');
insert into timezone values(368, 'Canada/Newfoundland');
insert into timezone values(369, 'Canada/Pacific');
insert into timezone values(370, 'Canada/Saskatchewan');
insert into timezone values(371, 'Canada/Yukon');
insert into timezone values(372, 'Chile/Continental');
insert into timezone values(373, 'Chile/EasterIsland');
insert into timezone values(374, 'Cuba');
insert into timezone values(375, 'EET');
insert into timezone values(376, 'EST5EDT');
insert into timezone values(377, 'Egypt');
insert into timezone values(378, 'Eire');
insert into timezone values(379, 'Etc/GMT');
insert into timezone values(380, 'Etc/GMT+0');
insert into timezone values(381, 'Etc/GMT+1');
insert into timezone values(382, 'Etc/GMT+10');
insert into timezone values(383, 'Etc/GMT+11');
insert into timezone values(384, 'Etc/GMT+12');
insert into timezone values(385, 'Etc/GMT+2');
insert into timezone values(386, 'Etc/GMT+3');
insert into timezone values(387, 'Etc/GMT+4');
insert into timezone values(388, 'Etc/GMT+5');
insert into timezone values(389, 'Etc/GMT+6');
insert into timezone values(390, 'Etc/GMT+7');
insert into timezone values(391, 'Etc/GMT+8');
insert into timezone values(392, 'Etc/GMT+9');
insert into timezone values(393, 'Etc/GMT-0');
insert into timezone values(394, 'Etc/GMT-1');
insert into timezone values(395, 'Etc/GMT-10');
insert into timezone values(396, 'Etc/GMT-11');
insert into timezone values(397, 'Etc/GMT-12');
insert into timezone values(398, 'Etc/GMT-13');
insert into timezone values(399, 'Etc/GMT-14');
insert into timezone values(400, 'Etc/GMT-2');
insert into timezone values(401, 'Etc/GMT-3');
insert into timezone values(402, 'Etc/GMT-4');
insert into timezone values(403, 'Etc/GMT-5');
insert into timezone values(404, 'Etc/GMT-6');
insert into timezone values(405, 'Etc/GMT-7');
insert into timezone values(406, 'Etc/GMT-8');
insert into timezone values(407, 'Etc/GMT-9');
insert into timezone values(408, 'Etc/GMT0');
insert into timezone values(409, 'Etc/Greenwich');
insert into timezone values(410, 'Etc/UCT');
insert into timezone values(411, 'Etc/UTC');
insert into timezone values(412, 'Etc/Universal');
insert into timezone values(413, 'Etc/Zulu');
insert into timezone values(414, 'Europe/Amsterdam');
insert into timezone values(415, 'Europe/Andorra');
insert into timezone values(416, 'Europe/Athens');
insert into timezone values(417, 'Europe/Belfast');
insert into timezone values(418, 'Europe/Belgrade');
insert into timezone values(419, 'Europe/Berlin');
insert into timezone values(420, 'Europe/Bratislava');
insert into timezone values(421, 'Europe/Brussels');
insert into timezone values(422, 'Europe/Bucharest');
insert into timezone values(423, 'Europe/Budapest');
insert into timezone values(424, 'Europe/Busingen');
insert into timezone values(425, 'Europe/Chisinau');
insert into timezone values(426, 'Europe/Copenhagen');
insert into timezone values(427, 'Europe/Dublin');
insert into timezone values(428, 'Europe/Gibraltar');
insert into timezone values(429, 'Europe/Guernsey');
insert into timezone values(430, 'Europe/Helsinki');
insert into timezone values(431, 'Europe/Isle_of_Man');
insert into timezone values(432, 'Europe/Istanbul');
insert into timezone values(433, 'Europe/Jersey');
insert into timezone values(434, 'Europe/Kaliningrad');
insert into timezone values(435, 'Europe/Kiev');
insert into timezone values(436, 'Europe/Lisbon');
insert into timezone values(437, 'Europe/Ljubljana');
insert into timezone values(438, 'Europe/London');
insert into timezone values(439, 'Europe/Luxembourg');
insert into timezone values(440, 'Europe/Madrid');
insert into timezone values(441, 'Europe/Malta');
insert into timezone values(442, 'Europe/Mariehamn');
insert into timezone values(443, 'Europe/Minsk');
insert into timezone values(444, 'Europe/Monaco');
insert into timezone values(445, 'Europe/Moscow');
insert into timezone values(446, 'Europe/Nicosia');
insert into timezone values(447, 'Europe/Oslo');
insert into timezone values(448, 'Europe/Paris');
insert into timezone values(449, 'Europe/Podgorica');
insert into timezone values(450, 'Europe/Prague');
insert into timezone values(451, 'Europe/Riga');
insert into timezone values(452, 'Europe/Rome');
insert into timezone values(453, 'Europe/Samara');
insert into timezone values(454, 'Europe/San_Marino');
insert into timezone values(455, 'Europe/Sarajevo');
insert into timezone values(456, 'Europe/Simferopol');
insert into timezone values(457, 'Europe/Skopje');
insert into timezone values(458, 'Europe/Sofia');
insert into timezone values(459, 'Europe/Stockholm');
insert into timezone values(460, 'Europe/Tallinn');
insert into timezone values(461, 'Europe/Tirane');
insert into timezone values(462, 'Europe/Tiraspol');
insert into timezone values(463, 'Europe/Uzhgorod');
insert into timezone values(464, 'Europe/Vaduz');
insert into timezone values(465, 'Europe/Vatican');
insert into timezone values(466, 'Europe/Vienna');
insert into timezone values(467, 'Europe/Vilnius');
insert into timezone values(468, 'Europe/Volgograd');
insert into timezone values(469, 'Europe/Warsaw');
insert into timezone values(470, 'Europe/Zagreb');
insert into timezone values(471, 'Europe/Zaporozhye');
insert into timezone values(472, 'Europe/Zurich');
insert into timezone values(473, 'GB');
insert into timezone values(474, 'GB-Eire');
insert into timezone values(475, 'GMT');
insert into timezone values(476, 'GMT0');
insert into timezone values(477, 'Greenwich');
insert into timezone values(478, 'Hongkong');
insert into timezone values(479, 'Iceland');
insert into timezone values(480, 'Indian/Antananarivo');
insert into timezone values(481, 'Indian/Chagos');
insert into timezone values(482, 'Indian/Christmas');
insert into timezone values(483, 'Indian/Cocos');
insert into timezone values(484, 'Indian/Comoro');
insert into timezone values(485, 'Indian/Kerguelen');
insert into timezone values(486, 'Indian/Mahe');
insert into timezone values(487, 'Indian/Maldives');
insert into timezone values(488, 'Indian/Mauritius');
insert into timezone values(489, 'Indian/Mayotte');
insert into timezone values(490, 'Indian/Reunion');
insert into timezone values(491, 'Iran');
insert into timezone values(492, 'Israel');
insert into timezone values(493, 'Jamaica');
insert into timezone values(494, 'Japan');
insert into timezone values(495, 'Kwajalein');
insert into timezone values(496, 'Libya');
insert into timezone values(497, 'MET');
insert into timezone values(498, 'MST7MDT');
insert into timezone values(499, 'Mexico/BajaNorte');
insert into timezone values(500, 'Mexico/BajaSur');
insert into timezone values(501, 'Mexico/General');
insert into timezone values(502, 'NZ');
insert into timezone values(503, 'NZ-CHAT');
insert into timezone values(504, 'Navajo');
insert into timezone values(505, 'PRC');
insert into timezone values(506, 'PST8PDT');
insert into timezone values(507, 'Pacific/Apia');
insert into timezone values(508, 'Pacific/Auckland');
insert into timezone values(509, 'Pacific/Chatham');
insert into timezone values(510, 'Pacific/Chuuk');
insert into timezone values(511, 'Pacific/Easter');
insert into timezone values(512, 'Pacific/Efate');
insert into timezone values(513, 'Pacific/Enderbury');
insert into timezone values(514, 'Pacific/Fakaofo');
insert into timezone values(515, 'Pacific/Fiji');
insert into timezone values(516, 'Pacific/Funafuti');
insert into timezone values(517, 'Pacific/Galapagos');
insert into timezone values(518, 'Pacific/Gambier');
insert into timezone values(519, 'Pacific/Guadalcanal');
insert into timezone values(520, 'Pacific/Guam');
insert into timezone values(521, 'Pacific/Honolulu');
insert into timezone values(522, 'Pacific/Johnston');
insert into timezone values(523, 'Pacific/Kiritimati');
insert into timezone values(524, 'Pacific/Kosrae');
insert into timezone values(525, 'Pacific/Kwajalein');
insert into timezone values(526, 'Pacific/Majuro');
insert into timezone values(527, 'Pacific/Marquesas');
insert into timezone values(528, 'Pacific/Midway');
insert into timezone values(529, 'Pacific/Nauru');
insert into timezone values(530, 'Pacific/Niue');
insert into timezone values(531, 'Pacific/Norfolk');
insert into timezone values(532, 'Pacific/Noumea');
insert into timezone values(533, 'Pacific/Pago_Pago');
insert into timezone values(534, 'Pacific/Palau');
insert into timezone values(535, 'Pacific/Pitcairn');
insert into timezone values(536, 'Pacific/Pohnpei');
insert into timezone values(537, 'Pacific/Ponape');
insert into timezone values(538, 'Pacific/Port_Moresby');
insert into timezone values(539, 'Pacific/Rarotonga');
insert into timezone values(540, 'Pacific/Saipan');
insert into timezone values(541, 'Pacific/Samoa');
insert into timezone values(542, 'Pacific/Tahiti');
insert into timezone values(543, 'Pacific/Tarawa');
insert into timezone values(544, 'Pacific/Tongatapu');
insert into timezone values(545, 'Pacific/Truk');
insert into timezone values(546, 'Pacific/Wake');
insert into timezone values(547, 'Pacific/Wallis');
insert into timezone values(548, 'Pacific/Yap');
insert into timezone values(549, 'Poland');
insert into timezone values(550, 'Portugal');
insert into timezone values(551, 'ROK');
insert into timezone values(552, 'Singapore');
insert into timezone values(553, 'SystemV/AST4');
insert into timezone values(554, 'SystemV/AST4ADT');
insert into timezone values(555, 'SystemV/CST6');
insert into timezone values(556, 'SystemV/CST6CDT');
insert into timezone values(557, 'SystemV/EST5');
insert into timezone values(558, 'SystemV/EST5EDT');
insert into timezone values(559, 'SystemV/HST10');
insert into timezone values(560, 'SystemV/MST7');
insert into timezone values(561, 'SystemV/MST7MDT');
insert into timezone values(562, 'SystemV/PST8');
insert into timezone values(563, 'SystemV/PST8PDT');
insert into timezone values(564, 'SystemV/YST9');
insert into timezone values(565, 'SystemV/YST9YDT');
insert into timezone values(566, 'Turkey');
insert into timezone values(567, 'UCT');
insert into timezone values(568, 'US/Alaska');
insert into timezone values(569, 'US/Aleutian');
insert into timezone values(570, 'US/Arizona');
insert into timezone values(571, 'US/Central');
insert into timezone values(572, 'US/East-Indiana');
insert into timezone values(573, 'US/Eastern');
insert into timezone values(574, 'US/Hawaii');
insert into timezone values(575, 'US/Indiana-Starke');
insert into timezone values(576, 'US/Michigan');
insert into timezone values(577, 'US/Mountain');
insert into timezone values(578, 'US/Pacific');
insert into timezone values(579, 'US/Pacific-New');
insert into timezone values(580, 'US/Samoa');
insert into timezone values(581, 'UTC');
insert into timezone values(582, 'Universal');
insert into timezone values(583, 'W-SU');
insert into timezone values(584, 'WET');
insert into timezone values(585, 'Zulu');
insert into timezone values(586, 'EST');
insert into timezone values(587, 'HST');
insert into timezone values(588, 'MST');
insert into timezone values(589, 'ACT');
insert into timezone values(590, 'AET');
insert into timezone values(591, 'AGT');
insert into timezone values(592, 'ART');
insert into timezone values(593, 'AST');
insert into timezone values(594, 'BET');
insert into timezone values(595, 'BST');
insert into timezone values(596, 'CAT');
insert into timezone values(597, 'CNT');
insert into timezone values(598, 'CST');
insert into timezone values(599, 'CTT');
insert into timezone values(600, 'EAT');
insert into timezone values(601, 'ECT');
insert into timezone values(602, 'IET');
insert into timezone values(603, 'IST');
insert into timezone values(604, 'JST');
insert into timezone values(605, 'MIT');
insert into timezone values(606, 'NET');
insert into timezone values(607, 'NST');
insert into timezone values(608, 'PLT');
insert into timezone values(609, 'PNT');
insert into timezone values(610, 'PRT');
insert into timezone values(611, 'PST');
insert into timezone values(612, 'SST');
insert into timezone values(613, 'VST');



delete from privilege where privilegeid>0;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(101,0,0,'menu.vsp','vsp.jsp','fa-cloud',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(104,0,0,'menu.page','page.jsp','fa-html5',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(109,0,0,'menu.systemmanage','','fa-cogs',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10901,0,109,'menu.config','config.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(202,1,0,'menu.org','org.jsp','fa-cloud',1,2);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(301,2,0,'menu.resource','','fa-qrcode',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30102,2,301,'menu.video','resource/video.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30104,2,301,'menu.image','resource/image.jsp','',1,4);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30105,2,301,'menu.audio','resource/audio.jsp','',1,5);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30107,2,301,'menu.stream','resource/stream.jsp','',1,7);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(302,2,0,'menu.devicemanage','','fa-desktop',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30211,2,302,'menu.device1','device/device1.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30213,2,302,'menu.device3','device/device3.jsp','',1,13);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30240,2,302,'menu.devicegroup','device/devicegroup.jsp','',1,40);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30250,2,302,'menu.deviceconfig','device/deviceconfig.jsp','',1,50);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30251,2,302,'menu.appfile','device/appfile.jsp','',1,51);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30252,2,302,'menu.deviceversion','device/deviceversion.jsp','',1,52);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(303,2,0,'menu.bundlemanage','','fa-paw',1,4);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30301,2,303,'menu.bundle','bundle/bundle.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30305,2,303,'menu.templet','bundle/templet.jsp','',1,5);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(304,2,0,'menu.pagemanage','','fa-html5',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30401,2,304,'menu.page','page/page.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30402,2,304,'menu.touchpage','page/page-touch.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30405,2,304,'menu.template','page/template.jsp','',1,5);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30406,2,304,'menu.touchtemplate','page/template-touch.jsp','',1,6);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(305,2,0,'menu.schedulemanage','','fa-calendar',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30501,2,305,'menu.schedule','plan/schedule-solo.jsp','',1,2);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30503,2,305,'menu.devicebundle','plan/device-bundle.jsp','',1,4);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30504,2,305,'menu.devicegroupbundle','plan/devicegroup-bundle.jsp','',1,5);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30505,2,305,'menu.pageplan','plan/plan-page.jsp','',1,6);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30506,2,305,'menu.pageplan','plan/device-page.jsp','',1,7);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30507,2,305,'menu.bundleplan','plan/plan-bundle.jsp','',1,2);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(308,2,0,'menu.stat','','fa-bar-chart-o',1,9);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30801,2,308,'menu.onlinelog','stat/onlinelog.jsp','',1,1);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30802,2,308,'menu.playlog','stat/playlog.jsp','',1,2);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30811,2,308,'menu.oplog','stat/oplog.jsp','',1,11);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30823,2,308,'menu.viewstat','stat/viewstat.jsp','',1,23);

insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(309,2,0,'menu.systemmanage','','fa-cogs',1,99);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30901,2,309,'menu.staff','system/staff.jsp','',1,1);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30902,2,309,'menu.role','system/role.jsp','',1,2);
#insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30903,2,309,'menu.branch','system/branch.jsp','',1,3);
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence) values(30909,2,309,'menu.config','system/config.jsp','',1,9);



############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
