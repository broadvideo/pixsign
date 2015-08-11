create table config( 
   configid int not null , 
   code varchar(32) not null ,
   name varchar(64) not null , 
   value varchar(1024) , 
   refer varchar(1024) , 
   type char(1) , 
   primary key (configid)
 )engine = innodb
default character set utf8;

create table vsp( 
   vspid int not null auto_increment , 
   name varchar(64) not null , 
   code varchar(16) not null , 
   status char(1) default '1' , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (vspid)
 )engine = innodb
default character set utf8;
 
create table org( 
   orgid int not null auto_increment , 
   vspid int not null ,
   name varchar(64) not null , 
   code varchar(16) not null , 
   status char(1) default '1' , 
   orgtype char(1) default '1' , 
   videoflag char(1) default '1' , 
   imageflag char(1) default '1' , 
   textflag char(1) default '1' , 
   liveflag char(1) default '1' , 
   widgetflag char(1) default '1' , 
   expireflag char(1) default '0' , 
   expiretime datetime , 
   maxdevices int , 
   maxstorage bigint , 
   uploadflag char(1) default '0' , 
   currentdevices int , 
   currentstorage bigint , 
   currentdeviceidx int , 
   copyright varchar(512) , 
   description varchar(512) , 
   backupmediaid int , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (orgid),
   foreign key (vspid) references vsp(vspid)
 )engine = innodb
default character set utf8;
 
create table branch( 
   branchid int not null auto_increment , 
   orgid int not null ,
   parentid int ,
   name varchar(64) not null , 
   code varchar(16) not null , 
   status char(1) default '1' , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (branchid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;
 
create table staff( 
   staffid int not null auto_increment , 
   subsystem char(1) default '1' ,
   vspid int ,
   orgid int ,
   branchid int ,
   loginname varchar(32) not null , 
   password varchar(128) , 
   name varchar(64) not null , 
   status char(1) default '1' , 
   token varchar(128) , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   loginflag char(1) default '0' , 
   logintime datetime ,
   primary key (staffid)
 )engine = innodb
default character set utf8;
 
create table role( 
   roleid int not null auto_increment , 
   subsystem char(1) default '1' ,
   vspid int ,
   orgid int ,
   name varchar(64) not null , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (roleid)
 )engine = innodb
default character set utf8;
 
create table privilege( 
   privilegeid int not null , 
   subsystem char(1) ,
   parentid int ,
   name varchar(64) , 
   menuurl varchar(512) , 
   icon varchar(32) , 
   type char(1) default '1' ,
   orgtype varchar(10) default '0' ,
   sequence int ,
   createtime timestamp not null default current_timestamp , 
   primary key (privilegeid)
 )engine = innodb
default character set utf8;

create table staffrole( 
   staffid int not null , 
   roleid int not null ,
   foreign key (staffid) references staff(staffid) ,
   foreign key (roleid) references role(roleid)
 )engine = innodb
default character set utf8;
alter table staffrole add unique(staffid, roleid);

create table staffprivilege( 
   staffid int not null , 
   privilegeid int not null ,
   foreign key (staffid) references staff(staffid) 
 )engine = innodb
default character set utf8;
alter table staffprivilege add unique(staffid, privilegeid);

create table roleprivilege( 
   roleid int not null , 
   privilegeid int not null ,
   foreign key (roleid) references role(roleid) 
 )engine = innodb
default character set utf8;
alter table roleprivilege add unique(roleid, privilegeid);

create table privilegeaction( 
   subsystem char(1) default '1' ,
   privilegeid int not null ,
   name varchar(64) , 
   value varchar(512) , 
   createtime timestamp not null default current_timestamp
 )engine = innodb
default character set utf8;
 
create table media( 
   mediaid int not null auto_increment , 
   orgid int not null ,
   branchid int not null ,
   name varchar(256) not null , 
   type char(1) default '1' , 
   filename varchar(256) not null , 
   size bigint ,
   md5 varchar(64) , 
   status char(1) default '1' , 
   complete int , 
   uploadtype char(1) default '0' , 
   uri varchar(1024) , 
   description varchar(2048) , 
   thumbnail blob ,
   contenttype varchar(64) ,
   previewduration int ,
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (mediaid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table livesource( 
   livesourceid int not null auto_increment , 
   orgid int not null ,
   name varchar(256) not null , 
   uri varchar(1024) not null , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (livesourceid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table widgetsource( 
   widgetsourceid int not null auto_increment , 
   orgid int not null ,
   name varchar(256) not null , 
   uri varchar(1024) not null , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (widgetsourceid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table device( 
   deviceid int not null auto_increment , 
   orgid int not null ,
   branchid int not null ,
   terminalid varchar(64) ,
   hardkey varchar(64) , 
   name varchar(64) not null , 
   position varchar(512) , 
   ip varchar(32) , 
   mac varchar(32) , 
   schedulestatus char(1) default '0' , 
   filestatus char(1) default '0' , 
   configstatus char(1) default '0' , 
   status char(1) default '1' , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   onlineflag char(1) default '0' , 
   onlinelayoutid int , 
   onlinemediaid int , 
   rate int , 
   version varchar(32) ,
   upgradeversion varchar(32) ,
   upgradestatus char(1) default '0' , 
   lastservertime datetime , 
   lastlocaltime datetime ,
   type char(1) default '1' , 
   groupcode varchar(128) default '' , 
   metrotype char(1) default '1' , 
   metrolineid int , 
   metrostationid int ,
   metroplatformid int , 
   metrodirection char(1) default '0' , 
   primary key (deviceid) , 
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table devicegroup( 
   devicegroupid int not null auto_increment , 
   orgid int not null ,
   branchid int not null ,
   name varchar(64) not null , 
   code varchar(32) , 
   status char(1) default '1' , 
   description varchar(512) , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (devicegroupid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table devicegroupdtl( 
   devicegroupdtlid int not null auto_increment , 
   devicegroupid int not null , 
   deviceid int not null ,
   primary key (devicegroupdtlid),
   foreign key (devicegroupid) references devicegroup(devicegroupid) ,
   foreign key (deviceid) references device(deviceid)
 )engine = innodb
default character set utf8;
ALTER TABLE devicegroupdtl ADD UNIQUE devicegroupdtl2(devicegroupid, deviceid);

create table layout( 
   layoutid int not null auto_increment , 
   orgid int not null ,
   branchid int not null ,
   name varchar(64) not null , 
   type char(1) default '0' , 
   xml longtext , 
   xmlsize bigint ,
   xmlmd5 varchar(64) ,
   height int , 
   width int , 
   bgmediaid int , 
   bgcolor varchar(6) , 
   status char(1) default '1' , 
   description varchar(512) , 
   mediaid int ,
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (layoutid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table region( 
   regionid int not null auto_increment ,
   layoutid int not null , 
   code varchar(32) ,  
   height int not null ,
   width int not null ,
   topoffset int not null ,
   leftoffset int not null ,
   zindex int not null ,
   primary key (regionid), 
   foreign key (layoutid) references layout(layoutid)
 )engine = innodb
default character set utf8;

create table regiondtl( 
   regiondtlid int not null auto_increment , 
   regionid int not null ,
   mediatype char(1) not null , 
   mediaid int , 
   duration int , 
   raw varchar(2048) ,
   direction char(1),
   speed int , 
   color varchar(7) , 
   size int , 
   opacity int , 
   sequence int ,
   uri varchar(512) ,
   fromdate datetime ,
   todate datetime ,
   primary key (regiondtlid),
   foreign key (regionid) references region(regionid)
 )engine = innodb
default character set utf8;

create table tpllayout( 
   tpllayoutid int not null auto_increment , 
   name varchar(64) not null , 
   type char(1) default '0' , 
   code varchar(32) , 
   status char(1) default '1' , 
   ratio char(1), 
   height int , 
   width int , 
   description varchar(512) , 
   primary key (tpllayoutid)
 )engine = innodb
default character set utf8;

create table tplregion( 
   tplregionid int not null auto_increment , 
   tpllayoutid int not null ,
   code varchar(32) , 
   height int not null ,
   width int not null ,
   topoffset int not null ,
   leftoffset int not null ,
   zindex int not null ,
   primary key (tplregionid), 
   foreign key (tpllayoutid) references tpllayout(tpllayoutid)
 )engine = innodb
default character set utf8;

create table task( 
   taskid int not null auto_increment , 
   orgid int not null ,
   branchid int not null ,
   name varchar(64) not null , 
   type char(1), 
   fromdate datetime , 
   todate datetime , 
   filesize bigint default 0 , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   primary key (taskid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table schedule( 
   scheduleid int not null auto_increment , 
   taskid int ,
   deviceid int not null ,
   layoutid int not null ,
   type char(1), 
   utype char(1) default '0' , 
   fromdate datetime , 
   todate datetime , 
   priority int , 
   syncstatus char(1), 
   status char(1), 
   complete int , 
   filesize bigint default 0 , 
   filesizecomplete bigint default 0 , 
   createtime timestamp not null default current_timestamp , 
   createstaffid int , 
   syncstarttime datetime , 
   syncendtime datetime , 
   primary key (scheduleid),
   foreign key (deviceid) references device(deviceid),
   foreign key (layoutid) references layout(layoutid)
 )engine = innodb
default character set utf8;

create table schedulefile( 
   schedulefileid int not null auto_increment , 
   scheduleid int not null ,
   deviceid int not null ,
   uploadtype char(1) default '0' , 
   filetype char(1) not null ,
   fileid int not null ,
   filename varchar(64) ,
   fileuri varchar(1024) ,
   filesize bigint ,
   md5 varchar(64) ,
   complete int , 
   status char(1), 
   description varchar(1024) , 
   createtime timestamp not null default current_timestamp , 
   updatetime datetime ,
   primary key (schedulefileid),
   foreign key (scheduleid) references schedule(scheduleid),
   foreign key (deviceid) references device(deviceid)
 )engine = innodb
default character set utf8;


create table devicefile( 
   devicefileid int not null auto_increment , 
   deviceid int not null ,
   uploadtype char(1) default '0' , 
   filetype char(1) not null ,
   fileid int not null ,
   filename varchar(64) ,
   fileuri varchar(128) ,
   filesize bigint ,
   md5 varchar(64) ,
   complete int , 
   status char(1), 
   name varchar(256), 
   syncstatus char(1), 
   description varchar(1024) , 
   createtime timestamp not null default current_timestamp , 
   updatetime datetime ,
   primary key (devicefileid),
   foreign key (deviceid) references device(deviceid)
 )engine = innodb
default character set utf8;

create table devicelog( 
   devicelogid int not null auto_increment , 
   deviceid int not null ,
   level char(1) not null ,
   message varchar(1024) ,
   createtime timestamp not null default current_timestamp , 
   primary key (devicelogid),
   foreign key (deviceid) references device(deviceid)
 )engine = innodb
default character set utf8;

create table selfapply( 
   selfapplyid int not null auto_increment , 
   email varchar(64) not null , 
   mobile varchar(16) , 
   name varchar(64) , 
   orgname varchar(64) , 
   orgcode varchar(16) , 
   description varchar(1024) , 
   status char(1) , 
   auditmemo varchar(1024), 
   createtime timestamp not null default current_timestamp , 
   primary key (selfapplyid)
 )engine = innodb
default character set utf8;


create table metroline( 
   metrolineid int , 
   name varchar(32) , 
   code varchar(32) , 
   primary key (metrolineid)
 )engine = innodb
default character set utf8;

create table metrostation( 
   metrostationid int , 
   name varchar(32) , 
   code varchar(32) , 
   groupcode varchar(32) , 
   primary key (metrostationid)
 )engine = innodb
default character set utf8;

create table metrolinestation( 
   metrolineid int , 
   metrostationid int , 
   sequence int
 )engine = innodb
default character set utf8;

create table metroplatform( 
   metroplatformid int not null auto_increment , 
   metrolineid int , 
   metrostationid int , 
   atsstationcode varchar(32) , 
   name varchar(32) , 
   code varchar(32) , 
   direction char(1) , 
   groupcode varchar(32) , 
   primary key (metroplatformid)
 )engine = innodb
default character set utf8;

