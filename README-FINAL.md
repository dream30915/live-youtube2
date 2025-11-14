Live Dashboard - FullHD Hybrid Snapshot + API
============================================

Overview
--------

- Pixel-perfect 1920x1080 dashboard designed for OBS / YouTube Live
- Puppeteer snapshot proxy (captures market pages as PNG backgrounds)
- API proxy (fetches HTML/JSON for parsing numbers)
- `start-all` scripts (sh + bat) will try ports and launch services
- Logs under `./logs`

Quick start (Linux/WSL/macOS)
-----------------------------

1. Install Node 16+ and Python 3
2. Copy files into a folder
3. `npm init -y`
4. `npm install express node-cache cors puppeteer node-fetch@2`
5. Put your overlay retouched image at `assets/overlay-retouched.png` (1920x1080)
6. Start with `start-all.sh` (`chmod +x start-all.sh`)
   `./start-all.sh`
7. Open `http://localhost:5500/index.html` in browser or use as Browser Source in OBS

Quick start (Windows)
---------------------

1. Install Node 16+ and Python 3
2. `npm install express node-cache cors puppeteer node-fetch@2`
3. Place `assets\overlay-retouched.png`
4. Double-click `start-all.bat` or run it from PowerShell

Notes & tuning
--------------

- Puppeteer will try to use Chrome/Edge paths (env `CHROME_PATH`/`EDGE_PATH` can override)
- If you have strict blocking, increase `SNAPSHOT_WAIT_MS` env var or set `SNAPSHOT_UA` for a more realistic UA
- Parsers are basic in `config.js`; for production, provide concrete API endpoints or sample HTML for fine-tuning
- For secure public deployment, put an nginx reverse proxy, TLS, auth, and rate-limiting

Security & Production
---------------------

- Use `pm2` plus the PM2 ecosystem file for production process management
- Set up `systemd` or Docker if desired
- Protect endpoints: add API key validation in proxies

ขั้นตอนหลังจากวางไฟล์แล้ว (สั้น ๆ)

1. วางไฟล์ทั้งหมดในโฟลเดอร์เดียวกัน (และสร้างโฟลเดอร์ `assets/` ที่มี `overlay-retouched.png`)
2. `npm init -y` แล้ว `npm install express node-cache cors puppeteer node-fetch@2`
3. รัน `chmod +x start-all.sh` (Linux/macOS) แล้ว `./start-all.sh` หรือรัน `start-all.bat` บน Windows
4. เปิด `http://localhost:5500/index.html` หรือใส่เป็น Browser Source ใน OBS
