# P-Track dev launcher: starts backend (:3000) and frontend (:5173) in their
# own terminal windows. Safe to re-run; a server whose port is already
# listening is skipped instead of double-started.
# Run via dev.cmd (bypasses execution policy) or:
#   powershell -ExecutionPolicy Bypass -File dev.ps1

$root = $PSScriptRoot

function Test-PortBusy([int]$port) {
    return [bool](Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)
}

function Start-DevServer([string]$label, [string]$dir, [int]$port) {
    if (Test-PortBusy $port) {
        Write-Host "$label already running on port $port - skipping." -ForegroundColor Yellow
        return
    }
    Write-Host "Starting $label on port $port..." -ForegroundColor Green
    # NODE_OPTIONS=--use-system-ca: corporate TLS interception breaks Node
    # network calls without it. Set inside the child window so it applies
    # regardless of how this script was launched.
    $command = "`$Host.UI.RawUI.WindowTitle = 'P-Track $label :$port'; " +
               "`$env:NODE_OPTIONS = '--use-system-ca'; " +
               "Set-Location '$dir'; " +
               "npm run dev"
    Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $command
}

Start-DevServer 'backend'  (Join-Path $root 'backend')  3000
Start-DevServer 'frontend' (Join-Path $root 'frontend') 5173

Write-Host ''
Write-Host 'Backend:  http://localhost:3000  (Swagger: /api/docs)'
Write-Host 'Frontend: http://localhost:5173'
Write-Host 'Close a server window (or Ctrl+C inside it) to stop that server.'
