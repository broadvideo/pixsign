# Pixsign


# 安装指南

## 安装环境准备
CentOS 7, JDK1.8.0 (/opt/pix/jdk8/)

## Build(需要 maven 3.3.3, JDK1.8)
- git clone git@192.168.0.202:pixsign/pixsign.git pixsign
- cd pixsign
- mvn clean
- mvn package
- 进入pixsign-dist/target目录获取pixsign-[version]-dist.tar.gz


## 安装、管理和配置
###安装    

- 上传压缩包至服务器/tmp/目录。
- 解压安装包后得到pixsign-[version]-dist目录
- 进入目录，执行安装脚本 ./install/install.sh


###配置



###服务管理

