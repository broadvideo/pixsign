CREATE DATABASE IF NOT EXISTS pixsign DEFAULT CHARSET utf8 COLLATE utf8_general_ci;

CREATE USER 'pixsign' IDENTIFIED BY 'pixsign@01';

GRANT ALL ON pixsign.* TO pixsign@'%';
