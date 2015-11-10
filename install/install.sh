#!/bin/bash

#
# Install pixsignage
#

# Goto base directory
cd `dirname $0`
BASE_DIR=`pwd`

echo
echo "Remove the old war files..."
rm -rf /opt/pix/tomcat8/webapps/pixsignage*
echo "Coping war to /opt/pix/tomcat8/webapps..."
cp -r *.war /opt/pix/tomcat8/webapps
echo "[OK]"

echo
echo "Installation success."

echo
