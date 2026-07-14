$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$nodeDir = Join-Path $root ".tools\node-v24.18.0-win-x64"
$npmCmd = Join-Path $nodeDir "npm.cmd"

if (-not (Test-Path -LiteralPath $npmCmd)) {
  Write-Error "Local Node.js runtime was not found at $nodeDir"
}

$env:Path = "$nodeDir;$env:Path"
Set-Location $root
& $npmCmd run dev
