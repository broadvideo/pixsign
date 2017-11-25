############################################################
## pre script  #############################################
############################################################

set @version = 17;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-16.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table templatezone add fixflag char(1) default '1';
alter table pagezone add fixflag char(1) default '1';

############################################################
## create table ############################################
############################################################

CREATE TABLE `wxappinfo` (
  `wxappinfoid` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `type` char(1) NOT NULL COMMENT '0：微信公众号',
  `appid` varchar(64) NOT NULL COMMENT '开发者ID',
  `appsecret` varchar(128) DEFAULT NULL COMMENT '开发者密码',
  `accesstoken` varchar(512) DEFAULT NULL COMMENT '应用access_token',
  `callbackurl` varchar(512) DEFAULT NULL COMMENT '回调地址',
  `token` varchar(32) DEFAULT NULL COMMENT '回调地址的令牌，用于验证签名',
  `encodingaeskey` varchar(50) DEFAULT NULL COMMENT '消息加密密钥',
  `encodingtype` char(1) DEFAULT '0' COMMENT '消息模式：0：明文  1：兼容模式 2：加密',
  `description` varchar(512) DEFAULT NULL COMMENT '描述信息',
  `createtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `orgid` int(11) NOT NULL COMMENT '关联的orgid',
  `status` char(1) NOT NULL COMMENT '状态：0：invalid 1：valid',
  PRIMARY KEY (`wxappinfoid`),
  UNIQUE KEY `uniq_type_appid_org_idx` (`type`,`appid`,`orgid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;


CREATE TABLE `doorlog` (
  `doorlogid` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增主键',
  `wxuserid` varchar(50) NOT NULL COMMENT '微信用户openid',
  `terminalid` varchar(50) NOT NULL COMMENT '终端id',
  `wxmpid` varchar(50) NOT NULL COMMENT '公众号id',
  `orgid` int(11) NOT NULL COMMENT '关联orgid',
  `doortype` char(1) DEFAULT NULL COMMENT '门类型：0-上柜门 1：下柜门',
  `openstate` char(1) DEFAULT NULL COMMENT '开门状态:0：失败 1：成功',
  `opentime` datetime DEFAULT NULL COMMENT '开门上报时间',
  `closestate` char(1) DEFAULT NULL COMMENT '关门状态： 0：失败 1：成功',
  `closetime` datetime DEFAULT NULL COMMENT '关门上报时间',
  `createtime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`doorlogid`),
  UNIQUE KEY `doorlogid` (`doorlogid`)
) ENGINE=InnoDB    DEFAULT CHARSET=utf8;


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
