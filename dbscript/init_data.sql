INSERT INTO vsp(name, code, status) VALUES('PIX', 'root', '1');

INSERT INTO staff(subsystem, vspid, loginname, password, name, status, token) VALUES('1', 1, 'admin', '9c6e77902e2a6feca343509566af87ff', 'admin', '1', 'admin_5926b1fafa508d17ff6e7a1c41e17b0f');
INSERT INTO privilege(privilegeid, subsystem, parentid, name, menuurl, icon, type, sequence, orgtype) VALUES(0, '', 0, 'SUPER', '', '', 2, 1, '0');
INSERT INTO staffprivilege(staffid, privilegeid) VALUES(1, 0);

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

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status, code) VALUES(1, '横屏16:9', 1080, 1920, '1', '0', '1', 'Global');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(1, 1, 1080, 1920, 0, 0, 0, 'Main');

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status, code) VALUES(2, '横屏16:9(下方字幕)', 1080, 1920, '1', '0', '1', 'Global_2_1');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(2, 2, 1080, 1920, 0, 0, 0, 'Main');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(3, 2, 80, 1920, 1000, 0, 1, 'Text');

INSERT INTO tpllayout(tpllayoutid, NAME, height, width, ratio, type, status, code) VALUES(3, '横屏16:9(上方字幕)', 1080, 1920, '1', '0', '1', 'Global_2_2');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(4, 3, 1080, 1920, 0, 0, 0, 'Main');
INSERT INTO tplregion(tplregionid, tpllayoutid, height, width, topoffset, leftoffset, zindex, code) VALUES(5, 3, 80, 1920, 0, 0, 1, 'Text');

insert into config(configid, code, name, value, type, refer) values(101, 'ServerIP', '服务器地址', '127.0.0.1', '1', '');
insert into config(configid, code, name, value, type, refer) values(102, 'ServerPort', '服务器端口', '9090', '1', '');


COMMIT;

