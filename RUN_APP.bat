@echo off
title ChartAnimator Studio
cd /d "%~dp0"
echo ===================================================
echo   CHARTANIMATOR STUDIO - KHOI DONG HE THONG
echo ===================================================
echo [1/2] Dang khoi dong Web Server tren cong 3000...
echo - May nay truy cap:      http://localhost:3000
echo - Team chung mang LAN:   http://192.168.100.123:3000
echo - Team qua Tailscale:    http://100.66.85.35:3000
echo ===================================================

start "" http://localhost:3000

set NEXT_TELEMETRY_DISABLED=1
npm run dev -- -H 0.0.0.0 -p 3000
pause

