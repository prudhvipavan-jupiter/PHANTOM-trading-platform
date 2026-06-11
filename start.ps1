# P.H.A.N.T.O.M — merged app with Paytm Money live trading
$root = $PSScriptRoot
Set-Location $root

Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install
npm run install:all

if (-not (Test-Path "$root\P.H.A.N.T.O.M-backend\.env")) {
  Copy-Item "$root\P.H.A.N.T.O.M-backend\.env.example" "$root\P.H.A.N.T.O.M-backend\.env"
  Write-Host "Created .env — add your Paytm API keys before live trading." -ForegroundColor Yellow
}

Write-Host "Building and starting on http://localhost:5000" -ForegroundColor Green
npm start
