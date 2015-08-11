INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status) VALUES(4, 'PIDS左L型', 1080, 1920, '1', '0', '1');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(6, 4, 1000, 700, 0, 0, 0, 'PIDS-Pixcast');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(7, 4, 1000, 1218, 0, 702, 0, 'PIDS-Main');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(8, 4, 78, 1920, 1002, 0, 0, 'PIDS-Text');

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status) VALUES(5, 'PIDS右L型', 1080, 1920, '1', '0', '1');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(9, 5, 1000, 1218, 0, 0, 0, 'PIDS-Main');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(10, 5, 1000, 700, 0, 1220, 0, 'PIDS-Pixcast');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(11, 5, 78, 1920, 1002, 0, 0, 'PIDS-Text');

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status) VALUES(6, 'PIDS上下型', 1080, 1920, '1', '0', '1');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(12, 6, 1000, 1920, 0, 0, 0, 'PIDS-Main');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(13, 6, 78, 1920, 1002, 0, 0, 'PIDS-Text');

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status) VALUES(7, 'PIDS局部消息', 1080, 1920, '1', '1', '1');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(14, 7, 78, 1920, 1002, 0, 0, 'PIDS-Text');

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status) VALUES(8, 'PIDS全屏消息', 1080, 1920, '1', '1', '1');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(15, 8, 1080, 1920, 0, 0, 0, 'PIDS-Text');

insert into metroline(metrolineid, name) values(1, '一号线');

insert into metrostation(metrostationid, name) values(1, '西朗');
insert into metrostation(metrostationid, name) values(2, '坑口');
insert into metrostation(metrostationid, name) values(3, '花地湾');
insert into metrostation(metrostationid, name) values(4, '芳村');
insert into metrostation(metrostationid, name) values(5, '黄沙');
insert into metrostation(metrostationid, name) values(6, '长寿路');
insert into metrostation(metrostationid, name) values(7, '陈家祠');
insert into metrostation(metrostationid, name) values(8, '西门口');
insert into metrostation(metrostationid, name) values(9, '公园前');
insert into metrostation(metrostationid, name) values(10, '农讲所');
insert into metrostation(metrostationid, name) values(11, '烈士陵园');
insert into metrostation(metrostationid, name) values(12, '东山口');
insert into metrostation(metrostationid, name) values(13, '杨箕');
insert into metrostation(metrostationid, name) values(14, '体育西路');
insert into metrostation(metrostationid, name) values(15, '体育中心');
insert into metrostation(metrostationid, name) values(16, '广州东站');

insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 1, '1', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 2, '2', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 3, '3', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 4, '4', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 5, '5', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 6, '6', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 7, '7', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 8, '8', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 9, '9', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 10, '10', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 11, '11', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 12, '12', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 13, '13', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 14, '14', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 15, '15', '0');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 16, '16', '0');

insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 1, '1', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 2, '2', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 3, '3', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 4, '4', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 5, '5', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 6, '6', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 7, '7', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 8, '8', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 9, '9', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 10, '10', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 11, '11', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 12, '12', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 13, '13', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 14, '14', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 15, '15', '1');
insert into metroplatform(metroplatformid, metrolineid, metrostationid, atsstationcode, direction) values(0, 1, 16, '16', '1');

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

update metroline set code=metrolineid;
update metrostation set code=metrostationid;
update metrostation set groupcode=concat('station_', code);
update metroline A,metrostation B,metroplatform C set C.name=concat(A.name, '.', B.name, '.', if(C.direction='0','上行','下行')) where A.metrolineid=C.metrolineid and B.metrostationid=C.metrostationid;
update metroline A,metrostation B,metroplatform C set C.code=concat(A.code, '_', B.code, '_', C.direction) where A.metrolineid=C.metrolineid and B.metrostationid=C.metrostationid;
update metroline A,metrostation B,metroplatform C set C.groupcode=concat('platform_', C.code) where A.metrolineid=C.metrolineid and B.metrostationid=C.metrostationid;

select @orgid:=orgid from org where code='pids';
select @branchid:=branchid from branch where code='pids_TOP';
select @staffid:=staffid from staff where orgid=@orgid and loginname='admin';

insert into devicegroup(devicegroupid,orgid,branchid,name,status,createstaffid,code) select 0, @orgid, @branchid, concat(name,'站厅'),'1',@staffid,concat('station_',code) from metrostation;
insert into devicegroup(devicegroupid,orgid,branchid,name,status,createstaffid,code) select 0, @orgid, @branchid, concat(name,'站台'),'1',@staffid,concat('platform_',code) from metroplatform;
