#!/usr/bin/env bash
# start-all.sh - tries ports 4000..4020 for snapshot proxy and 4100..4120 for api proxy
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

start_service(){
  local script=$1; shift
  local base_port=$1; shift
  local max_try=$2; shift
  for ((p=base_port; p<base_port+max_try; p++)); do
    if ! lsof -iTCP -sTCP:LISTEN -P -n | grep -q ":$p "; then
      echo "Starting $script on port $p"
      PORT=$p nohup node $script > logs/$script.$p.log 2>&1 &
      echo $! > .pid_${script}_$p
      echo $p
      return 0
    fi
  done
  return 1
}

mkdir -p logs
start_service puppeteer-proxy.js 4000 20 || { echo "no port for puppeteer-proxy"; exit 1; }
start_service api-proxy.js 4100 20 || { echo "no port for api-proxy"; exit 1; }
# static server
python3 -m http.server 5500 &

echo "Started. Open http://localhost:5500/index.html"
