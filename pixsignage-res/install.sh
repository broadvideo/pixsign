#!/bin/bash

#
# Install pixsignage res
#

# Goto base directory
cd `dirname $0`
BASE_DIR=`pwd`

echo
echo "Remove the old files..."
rm -rf /opt/pix/pixsignage-res
echo "Coping files to /opt/pix/pixsignage-res..."
mkdir -p /opt/pix/pixsignage-res
cp -rf admin /opt/pix/pixsignage-res
cp -rf frontend /opt/pix/pixsignage-res
cp -rf global /opt/pix/pixsignage-res
chown -R pix:pix /opt/pix/pixsignage-res
echo "[OK]"

echo
echo "Installation success."

echo
