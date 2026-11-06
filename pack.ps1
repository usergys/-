# Build release tarball: release/xiuwei-release-<timestamp>.tar.gz
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
New-Item -ItemType Directory -Force -Path "release" | Out-Null
$out = Join-Path (Get-Location).Path "release\xiuwei-release-$stamp.tar.gz"

if (-not (Test-Path "dist/index.html")) { throw "dist/index.html not found, run build first" }

tar -czf "$out" `
  --exclude=node_modules `
  --exclude=dist.prev `
  --exclude=dist.failed `
  --exclude=release `
  --exclude=public `
  --exclude=src `
  --exclude=server/uploads `
  --exclude=*.log `
  --exclude=deploy/admin.token `
  --exclude=.git `
  -C .. xiuwei

$size = [math]::Round((Get-Item $out).Length / 1MB, 1)
Write-Host "Release package: $out ($size MB)"
Write-Host "Upload: scp `"$out`" root@SERVER_IP:/root/"
