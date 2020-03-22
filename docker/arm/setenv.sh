#!/bin/bash
totalMemKB=$(awk '/MemTotal:/ { print $2 }' /proc/meminfo)
usagePercent=75
let heapKB=$totalMemKB*$usagePercent/100
let heapMB=$heapKB/1024
let max=$(( $heapMB > 512 ? $heapMB : 512 ))
export CATALINA_OPTS="$CATALINA_OPTS -Xmx${heapMB}m"
export JAVA_OPTS="$JAVA_OPTS -Xmx${heapMB}m"
