#!/usr/bin/env powershell

# SkillMatch Frontend Startup Script

Write-Host "
════════════════════════════════════════════════════════════════
  SkillMatch - Frontend Server Startup
════════════════════════════════════════════════════════════════
" -ForegroundColor Cyan

# Navigate to frontend directory
Set-Location "C:\Users\Admin\Desktop\Minor\skillmatch-app\frontend"

# Display status
Write-Host "📁 Current Directory: $(Get-Location)" -ForegroundColor Green
Write-Host "🔧 Node Version: $(node --version)" -ForegroundColor Green
Write-Host "📦 NPM Version: $(npm --version)" -ForegroundColor Green

# Set environment variables
$env:BROWSER = 'none'
$env:SKIP_PREFLIGHT_CHECK = 'true'
$env:PORT = 3000

Write-Host "
🚀 Starting React Development Server...
" -ForegroundColor Yellow

# Start the server
npm start

Write-Host "
✅ Server started on http://localhost:3000
" -ForegroundColor Green
