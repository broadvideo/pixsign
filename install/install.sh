#!/bin/bash

#
# Install pixmovie
#

# Goto base directory
cd `dirname $0`
cd ..
BASE_DIR=`pwd`

echo
echo "Remove the old war files..."
rm -rf /opt/pix/tomcat8/webapps/pixsignage*
rm -rf /opt/pix/tomcat8/webapps/pixservice*
echo "Coping war to /opt/pix/tomcat8/webapps..."
cp -r *.war /opt/pix/tomcat8/webapps
echo "[OK]"

echo
echo "Restart tomcat service..."
sudo service tomcat8 restart

echo
echo "Installation success."

echo
