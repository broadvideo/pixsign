#!/bin/bash
# Install pixedxapi
#
# Goto base directory
cd `dirname $0`
BASE_DIR=`pwd`
echo "Remove 
 old war files..."
rm -rf /opt/pix/tomcat8/webapps/pixedxapi.war
rm -rf /opt/pix/tomcat8/webapps/pixedxapi
echo "Coping war to /opt/pix/tomcat8/webapps..."
cp -r pixedxapi.war /opt/pix/tomcat8/webapps
echo "[OK]"
echo "Installation success."
