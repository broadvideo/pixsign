############################################################
## pre script  #############################################
############################################################

set @version = 6;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-5.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table vsp add mscreenflag char(1) default '0';
alter table org add mscreenflag char(1) default '0';
alter table org add maxmdevices int default 0;
alter table org add currentmdevices int default 0;
alter table org add currentmdeviceidx int default 0;

alter table device add sign varchar(64) default '';
alter table device change version vname varchar(32) default '';
alter table device add vcode int default 0;
alter table device add devicegridid int default 0;
alter table device add xpos int default 0;
alter table device add ypos int default 0;

alter table msgevent change msgtype msgtype char(2);

create table gridlayout( 
   gridlayoutid int not null auto_increment,
   gridlayoutcode varchar(32),
   xcount int,
   ycount int,
   ratio char(1) default '1',
   width int,
   height int,
   primary key (gridlayoutid)
 )engine = innodb
default character set utf8;

create table mmedia( 
   mmediaid int not null auto_increment,
   objtype char(1) not null,
   objid int not null,
   xcount int not null,
   ycount int not null,
   status char(1) default '1',
   createtime timestamp not null default current_timestamp,
   primary key (mmediaid)
 )engine = innodb
default character set utf8;

create table mmediadtl( 
   mmediadtlid int not null auto_increment,
   mmediaid int not null,
   xpos int not null,
   ypos int not null,
   fileidx varchar(32),
   filepath varchar(64),
   filename varchar(32),
   size bigint,
   createtime timestamp not null default current_timestamp,
   primary key (mmediadtlid)
 )engine = innodb
default character set utf8;

create table mediagrid( 
   mediagridid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   gridlayoutcode varchar(32),
   name varchar(64) default '',
   xcount int default 1,
   ycount int default 1,
   ratio char(1) default '1',
   width int default 0,
   height int default 0,
   intervaltime int default 10,
   snapshot varchar(128) default '',
   status char(1) default '1',
   createtime timestamp not null default current_timestamp,
   primary key (mediagridid)
 )engine = innodb
default character set utf8;

create table mediagriddtl( 
   mediagriddtlid int not null auto_increment,
   mediagridid int not null,
   xpos int not null,
   ypos int not null,
   xcount int not null,
   ycount int not null,
   objtype char(1) not null,
   objid int not null,
   mmediaid int default 0,
   createtime timestamp not null default current_timestamp,
   primary key (mediagriddtlid)
 )engine = innodb
default character set utf8;

create table devicegrid( 
   devicegridid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(64) not null,
   gridlayoutcode varchar(32),
   xcount int default 1,
   ycount int default 1,
   ratio char(1) default '1',
   width int default 0,
   height int default 0,
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   primary key (devicegridid),
   foreign key (orgid) references org(orgid),
   foreign key (branchid) references branch(branchid)
 )engine = innodb
default character set utf8;

create table gridschedule( 
   gridscheduleid int not null auto_increment,
   devicegridid int not null,
   playmode char(1) not null,
   playdate date,
   starttime time,
   endtime time,
   createtime timestamp not null default current_timestamp,
   primary key (gridscheduleid)
 )engine = innodb
default character set utf8;

create table gridscheduledtl( 
   gridscheduledtlid int not null auto_increment,
   gridscheduleid int not null,
   mediagridid int not null,
   sequence int not null,
   primary key (gridscheduledtlid)
 )engine = innodb
default character set utf8;

create table pagepkg( 
   pagepkgid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   name varchar(64) not null,
   indexpageid int default 0,
   status char(1) default '1',
   ratio char(1) default '1',
   height int not null,
   width int not null,
   snapshot varchar(128),
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   updatetime datetime not null,
   createstaffid int,
   primary key (pagepkgid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table page( 
   pageid int not null auto_increment,
   orgid int not null,
   branchid int not null,
   pagepkgid int not null default 0,
   templateid int default 0,
   templateflag char(1) default '0',
   name varchar(64) not null,
   type char(1) default '0',
   status char(1) default '1',
   entry char(1) default '1',
   ratio char(1) default '1',
   height int not null,
   width int not null,
   snapshot varchar(128),
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   updatetime datetime not null,
   createstaffid int,
   primary key (pageid),
   foreign key (orgid) references org(orgid)
 )engine = innodb
default character set utf8;

create table pagezone( 
   pagezoneid int not null auto_increment,
   pageid int not null,
   name varchar(64),
   type char(1) not null,
   status char(1) default '1',
   height varchar(32) not null,
   width varchar(32) not null,
   topoffset varchar(32) not null,
   leftoffset varchar(32) not null,
   zindex int not null default 0,
   transform varchar(128),
   bdcolor varchar(32) default '#000000',
   bdstyle varchar(128),
   bdwidth varchar(32) default '0',
   bdtl varchar(32),
   bdtr varchar(32),
   bdbl varchar(32),
   bdbr varchar(32),
   bgcolor varchar(32) default '#FFFFFF',
   opacity int default 0,
   padding varchar(32),
   shadow varchar(128),
   color varchar(32) default '#000000',
   fontfamily varchar(32),
   fontsize varchar(32),
   fontweight varchar(32),
   fontstyle varchar(32),
   decoration varchar(32),
   align varchar(32),
   lineheight varchar(32),
   linkpageid int default 0,
   imageid varchar(256),
   videoid varchar(256),
   content longtext,
   createtime timestamp not null default current_timestamp,
   primary key (pagezoneid),
   foreign key (pageid) references page(pageid)
 )engine = innodb
default character set utf8;


insert into gridlayout(gridlayoutcode, xcount, ycount, ratio, width, height) values('3-1-1', 3, 1, 1, 5760, 1080);
insert into gridlayout(gridlayoutcode, xcount, ycount, ratio, width, height) values('1-3-1', 1, 3, 1, 1920, 3240);
insert into gridlayout(gridlayoutcode, xcount, ycount, ratio, width, height) values('2-2-1', 2, 2, 1, 3840, 2160);

############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
