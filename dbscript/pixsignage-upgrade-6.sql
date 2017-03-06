############################################################
## pre script  #############################################
############################################################

set @version = 7;
set @module = 'pixsignage';
set @dbscript=concat(@module , '-upgrade-6.sql');
insert into dbversion(version, dbscript, type, status) values(@version, @dbscript, '2', '0');
select last_insert_id() into @dbversionid;


############################################################
## upgrade script ##########################################
############################################################

create table debugreport( 
   debugreportid int not null auto_increment,
   deviceid int,
   hardkey varchar(64),
   filepath varchar(64),
   createtime timestamp not null default current_timestamp,
   primary key (debugreportid)
 )engine = innodb
default character set utf8;

delete from privilege where parentid=109;
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10901,0,109,'menu.config','config.jsp','',1,1,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10902,0,109,'menu.debug','debugreport.jsp','',1,2,'0');
insert into privilege(privilegeid,subsystem,parentid,name,menuurl,icon,type,sequence,orgtype) values(10903,0,109,'menu.crash','crashreport.jsp','',1,3,'0');


############################################################
## post script  ############################################
############################################################

update dbversion set status='1' where dbversionid=@dbversionid;
update dbversion set version=@version, createtime=now() where type='0';
