#!/bin/sh
cd /Users/jiangchuanyou/Desktop/项目/node博客项目/logs
cp access.log $(date +%Y-%m-%d).access.log
echo '' > access.log