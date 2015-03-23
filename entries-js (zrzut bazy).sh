#!/bin/sh

cd Desktop
mongodump -h ds047911.mongolab.com:47911 -d entries-js -u nairdacom -p GDRKZ27g -o Zrzut_bazy

echo "Kopia bazy wykonana!"