# Pixsignage


# 安装指南

## 安装环境准备
CentOS 7, JDK1.8.0 (/opt/pix/jdk8/)

## Build(需要 maven 3.3.3, JDK1.8)
- git clone git@192.168.0.202:pixsignage/pixsignage.git pixsignage
- cd pixsignage
- mvn install:install-file -Dfile=lib/gif4j.jar -DgroupId=gif4j -DartifactId=gif4j -Dversion=1.0 -Dpackaging=jar
- mvn clean
- mvn package
- 进入pixsignage-dist/target目录获取pixsignage-[version]-dist.tar.gz


## 安装、管理和配置
###安装    

- 上传压缩包至服务器/tmp/目录。
- 解压安装包后得到pixsignage-[version]-dist目录
- 进入目录，执行安装脚本 ./install/install.sh


###配置



###服务管理

