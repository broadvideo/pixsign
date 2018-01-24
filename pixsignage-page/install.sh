#!/bin/bash

#
# Install pixsignage-page
#

# Goto base directory
cd `dirname $0`
BASE_DIR=`pwd`

echo
echo "Remove the old files..."
rm -rf /opt/pix/pixsignage-page
mkdir -p /opt/pix/pixsignage-page
cp -r fonts /opt/pix/pixsignage-page
cp -r module /opt/pix/pixsignage-page
cp -r pixpage /opt/pix/pixsignage-page
cp -r plugin /opt/pix/pixsignage-page
cp index.html /opt/pix/pixsignage-page
chown -R pix:pix /opt/pix/pixsignage-page
echo "[OK]"

echo
echo "Installation success."

echo
