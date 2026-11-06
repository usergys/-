# Production start script (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File .\deploy\start-prod.ps1
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)

$env:NODE_ENV  = "production"
$env:PORT      = if ($env:PORT) { $env:PORT } else { "3001" }
$env:DB_DRIVER = if ($env:DB_DRIVER) { $env:DB_DRIVER } else { "json" }

$tokenFile = Join-Path $PSScriptRoot "admin.token"
if (-not (Test-Path $tokenFile)) {
  $bytes = New-Object byte[] 24
  [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  [Convert]::ToBase64String($bytes).Replace("+", "A").Replace("/", "B").TrimEnd("=") | Set-Content -NoNewline -Encoding ascii $tokenFile
}
$env:ADMIN_TOKEN = (Get-Content $tokenFile -Raw).Trim()

Write-Host "Starting production server on port $($env:PORT) (driver: $($env:DB_DRIVER))"
Write-Host "Admin token file: $tokenFile"
node server/index.js
