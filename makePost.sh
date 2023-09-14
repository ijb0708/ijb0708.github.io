#!/bin/sh

RELATIVE_DIR=`dirname "$0"`

echo $RELATIVE_DIR

echo today is $(date +"%y-%m-%d")

echo title is? : 
read title

fileName=$(date +"%y-%m-%d")-$title.md

echo filename is $fileName

cd $RELATIVE_DIR/_posts
touch $fileName

echo --- >> $fileName
echo title: $title >> $fileName
echo date: $(date +"%y-%m-%d %H:%M")  >> $fileName
echo --- >> $fileName