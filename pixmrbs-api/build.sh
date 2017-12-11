#!/bin/bash

#
#	Build restapi project with numberic buildNumber, build number will persist in to buildNumber.properties
#

# Goto base directory
cd `dirname $0`
base_dir=`pwd` 
bn_file=${base_dir}/buildNumber.properties

if [ ! -f "${bn_file}" ];  then
	echo "Build number file not exist, creating new one."
	echo 0 > ${bn_file}
fi

# Get new build number
cur_bn=`cat ${bn_file}`
((cur_bn++))
if [ $? -ne 0 ];then 
	echo "Build number is not integer, restart from 1."
	cur_bn=1;
fi

build_time=`date  "+%Y-%m-%d %H:%M:%S %z"`
# Get scm info
scm_branch=`git branch | cut -d " " -f 2`
scm_version=`git log | head -n 1 | cut -d " " -f 2`

echo
echo "About to build project with new build number ${cur_bn}!"
mvn clean deploy  -DbuildNumber=${cur_bn} -DscmBranch="${scm_branch}" -DscmVersion="${scm_version}" -DbuildTime="${build_time}"
result=$?
if [ $result -ne 0 ]; then
	echo
	echo "Packaging failed, please check the log, build process exit with $result!"
	exit -1;
else
	echo "[ok]"
fi

# Write new build number back
echo
echo "Write build number [${cur_bn}] to ${bn_file}!"
echo ${cur_bn} > ${bn_file}
echo "[ok]"

echo
echo "Build success."
