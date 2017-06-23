############################################################
## pre script  #############################################
############################################################

set @version = 10;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-9.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

alter table pagezone add bgopacity int default 255;

alter table pagezone modify height int;
alter table pagezone modify width int;
alter table pagezone modify topoffset int;
alter table pagezone modify leftoffset int;
alter table pagezone modify bdwidth int default 0;
alter table pagezone modify bdtl int default 0;
alter table pagezone modify bdtr int default 0;
alter table pagezone modify bdbl int default 0;
alter table pagezone modify bdbr int default 0;
alter table pagezone modify padding int default 0;
alter table pagezone modify fontsize int default 0;
alter table pagezone modify lineheight int default 0;
alter table pagezone modify fontweight varchar(32) default '';


create table ptemplet( 
   ptempletid int not null auto_increment,
   uuid varchar(64) not null,
   orgid int not null,
   name varchar(64) not null,
   snapshot varchar(128),
   ratio char(1) default '1',
   height int not null,
   width int not null,
   publicflag char(1) default '0',
   status char(1) default '1',
   description varchar(512),
   createtime timestamp not null default current_timestamp,
   createstaffid int,
   primary key (ptempletid)
 )engine = innodb
default character set utf8;

create table ptempletzone( 
   ptempletzoneid int not null auto_increment,
   ptempletid int not null,
   type tinyint not null,
   height int not null,
   width int not null,
   topoffset int not null,
   leftoffset int not null,
   zindex int not null default 0,
   transform varchar(128),
   bdcolor varchar(32) default '#000000',
   bdstyle varchar(128),
   bdwidth int default 0,
   bdtl int default 0,
   bdtr int default 0,
   bdbl int default 0,
   bdbr int default 0,
   bgcolor varchar(32) default '#FFFFFF',
   bgopacity int default 0,
   opacity int default 0,
   padding int default 0,
   shadowh int default 0,
   shadowv int default 0,
   shadowblur int default 0,
   shadowcolor varchar(8) default '#000000',
   color varchar(32) default '#000000',
   fontfamily varchar(32),
   fontsize int default 0,
   fontweight varchar(32),
   fontstyle varchar(32),
   decoration varchar(32),
   align varchar(32),
   lineheight int default 0,
   content longtext,
   objid varchar(1024),
   primary key (ptempletzoneid),
   foreign key (ptempletid) references ptemplet(ptempletid)
 )engine = innodb
default character set utf8;


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
