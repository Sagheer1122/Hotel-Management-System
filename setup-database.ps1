# HMS Database Setup Script
# Run this after installing PostgreSQL

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  HMS Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL status..." -ForegroundColor Yellow
$pgService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue

if ($pgService) {
    if ($pgService.Status -eq "Running") {
        Write-Host "✓ PostgreSQL is running" -ForegroundColor Green
    } else {
        Write-Host "✗ PostgreSQL is installed but not running" -ForegroundColor Red
        Write-Host "Starting PostgreSQL..." -ForegroundColor Yellow
        Start-Service $pgService.Name
        Write-Host "✓ PostgreSQL started" -ForegroundColor Green
    }
} else {
    Write-Host "✗ PostgreSQL is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install PostgreSQL first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://www.postgresql.org/download/windows/" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Set password to: password" -ForegroundColor White
    Write-Host "4. Keep port as: 5432" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow
Set-Location "hms-api"
rails db:create

Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Yellow
rails db:migrate

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start Rails server: rails server" -ForegroundColor White
Write-Host "2. Start React app: cd ../hms-frontend && npm run dev" -ForegroundColor White
Write-Host ""
