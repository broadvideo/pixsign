drop table movielog;
drop table calldtl;
drop table billdtl;
drop table bill;
drop table orderitem;
drop table deviceevent;
drop table moviekey;
drop table deviceconfig;
drop table genre;
drop table privilegeaction;
drop table config;
drop table version;

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

alter table org drop movieflag;
alter table org drop advertflag;

alter table staff add token varchar(128);
update staff set token=uploadkey;
alter table staff drop uploadkey;

alter table media drop uuid;
alter table media drop director;
alter table media drop cast;
alter table media drop publishdate;
alter table media drop genre;
alter table media drop duration;
alter table media drop poster;

alter table device drop serviceurl;
alter table device drop staturl;
alter table device drop asp;
alter table device drop volume;
alter table device drop port;
alter table device drop refreshtime;
alter table device drop loglevel;
alter table device drop videodownloadmode;
alter table device drop videodownloadserver;
alter table device drop xlfdownloadserver;
alter table device drop imgdownloadserver;
alter table device drop upgradedownloadserver;
alter table device drop moviedownloadserver;
alter table device drop licensedownloadserver;
alter table device drop defaultlayoutid;
alter table device drop playuuid;
alter table device drop playname;
alter table device drop playduration;
alter table device drop playpts;
alter table device drop billid;
alter table device drop billflag;
alter table device drop maxtimes;
alter table device drop currenttimes;
alter table device drop price;
alter table device drop notifystatus;
alter table device drop billstarttime;

alter table devicefile drop uuid;
alter table devicefile drop licenseflag;
alter table devicefile drop localflag;

alter table org add backupmediaid int;

delete from privilege where privilegeid>0;
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(101, 1, 0, '企业管理', '', 'fa-cloud', 1, 1, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(10101, 1, 101, '企业管理', 'org.jsp', '', 1, 1, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(10102, 1, 101, '布局模板', 'tpllayout.jsp', '', 1, 2, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(102, 1, 0, '运营管理', '', 'fa-group', 1, 2, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(10201, 1, 102, '审核申请', 'audit.jsp', '', 1, 1, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(109, 1, 0, '系统管理', '', 'fa-cogs', 1, 9, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(10901, 1, 109, '操作员管理', 'staff.jsp', '', 1, 1, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(10902, 1, 109, '角色管理', 'role.jsp', '', 1, 2, '0');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(10909, 1, 109, '系统配置', 'config.jsp', '', 1, 9, '0');

INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(301, 2, 0, '快速发布', 'wizard.jsp', 'fa-hand-o-up', 1, 1, '1');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(302, 2, 0, '快速发布', 'wizard_pids.jsp', 'fa-hand-o-up', 1, 1, '3');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(303, 2, 0, '紧急发布', 'wizard_pids_u.jsp', 'fa-bolt', 1, 1, '3');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(201, 2, 0, '媒体管理', '', 'fa-video-camera', 1, 2, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20101, 2, 201, '视频管理', 'video.jsp', '', 1, 1, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20102, 2, 201, '图片管理', 'image.jsp', '', 1, 2, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20103, 2, 201, '直播源管理', 'live.jsp', '', 1, 3, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20104, 2, 201, 'Widget管理', 'widget.jsp', '', 1, 4, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(202, 2, 0, '终端管理', '', 'fa-desktop', 1, 3, '123');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20201, 2, 202, '终端管理', 'device.jsp', '', 1, 1, '1');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20202, 2, 202, '终端组管理', 'devicegp.jsp', '', 1, 2, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20211, 2, 202, '终端管理', 'device_pids.jsp', '', 1, 1, '3');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(203, 2, 0, '播出管理', '', 'fa-calendar', 1, 4, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20301, 2, 203, '任务管理', 'task.jsp', '', 1, 1, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20302, 2, 203, '播放计划', 'schedule.jsp', '', 1, 2, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20303, 2, 203, '节目单管理', 'layout.jsp', '', 1, 3, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(209, 2, 0, '系统管理', '', 'fa-cogs', 1, 10, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20901, 2, 209, '操作员管理', 'staff.jsp', '', 1, 1, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20902, 2, 209, '角色管理', 'role.jsp', '', 1, 2, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20903, 2, 209, '部门管理', 'branch.jsp', '', 1, 3, '13');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(20909, 2, 209, '系统配置', 'config.jsp', '', 1, 9, '13');

insert into config(configid, code, name, value, type, refer) values(101, 'ServerIP', '服务器地址', '127.0.0.1', '1', '');
insert into config(configid, code, name, value, type, refer) values(102, 'ServerPort', '服务器端口', '9090', '1', '');

alter table device add metrotype char(1) default '1';
alter table device add metrolineid int;
alter table device add metrostationid int;
alter table device add metroplatformid int;
alter table device add metrodirection char(1) default '0';

create table metrolinestation( 
   metrolineid int , 
   metrostationid int , 
   sequence int
 )engine = innodb
default character set utf8;

insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 1, 1);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 2, 2);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 3, 3);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 4, 4);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 5, 5);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 6, 6);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 7, 7);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 8, 8);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 9, 9);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 10, 10);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 11, 11);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 12, 12);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 13, 13);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 14, 14);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 15, 15);
insert into metrolinestation(metrolineid, metrostationid, sequence) values(1, 16, 16);

