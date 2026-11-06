# Rollback to previous build (restore dist.prev and restart)
# Usage: powershell -ExecutionPolicy Bypass -File .\deploy\rollback.ps1
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
$PORT = if ($env:PORT) { $env:PORT } else { 3001 }

if (-not (Test-Path "dist.prev")) { throw "dist.prev not found, cannot rollback" }

Write-Host "1/4 stop service on port $PORT"
$c = Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue
if ($c) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue; Start-Sleep 2 }

Write-Host "2/4 backup current build as dist.failed"
if (Test-Path "dist.failed") { Remove-Item -Recurse -Force "dist.failed" }
if (Test-Path "dist") { Rename-Item dist "dist.failed" }

Write-Host "3/4 restore previous build"
Rename-Item "dist.prev" "dist"

Write-Host "4/4 restart service"
& (Join-Path $PSScriptRoot "start-prod.ps1")
