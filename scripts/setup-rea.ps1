# Script thiết lập REA MCP Server cho dự án ChartAnimator
Write-Host ">>> Đang thiết lập REA MCP Server..." -ForegroundColor Cyan

# Kiểm tra Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Chưa cài đặt Node.js. Vui lòng cài Node.js trước khi tiếp tục."
    exit 1
}

# Chạy lệnh setup REA
Write-Host ">>> Kích hoạt npx rea-agents setup..." -ForegroundColor Yellow
npx -y rea-agents setup

Write-Host ">>> Hoàn tất thiết lập REA MCP. Kiểm tra file .mcp.json để xác nhận." -ForegroundColor Green
