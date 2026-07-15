# Helper to generate minimal microservice skeleton (run manually if needed)
param([string]$Name, [int]$Port, [string]$Package)
Write-Host "Scaffold $Name on port $Port package $Package"
