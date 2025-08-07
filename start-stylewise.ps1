# Script para iniciar o StyleWise completo (Frontend + Backend)
param(
    [Parameter()]
    [string]$Action = "start"
)

Write-Host "🎨 StyleWise - AI Fashion Assistant" -ForegroundColor Magenta
Write-Host "====================================" -ForegroundColor Magenta

$frontendPath = "C:\Users\lardo\OneDrive\Área de Trabalho\Style_front-end"
$backendPath = "$frontendPath\stylewise-backend"

function Start-Services {
    Write-Host "🚀 Iniciando serviços..." -ForegroundColor Green
    
    # Verificar se as pastas existem
    if (!(Test-Path $frontendPath)) {
        Write-Host "❌ Pasta do frontend não encontrada: $frontendPath" -ForegroundColor Red
        return
    }
    
    if (!(Test-Path $backendPath)) {
        Write-Host "❌ Pasta do backend não encontrada: $backendPath" -ForegroundColor Red
        return
    }
    
    # Verificar node_modules do backend
    if (!(Test-Path "$backendPath\node_modules")) {
        Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
        Set-Location $backendPath
        npm install
    }
    
    # Verificar node_modules do frontend
    if (!(Test-Path "$frontendPath\node_modules")) {
        Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
        Set-Location $frontendPath
        npm install
    }
    
    Write-Host "✅ Dependências verificadas" -ForegroundColor Green
    
    # Iniciar backend em nova janela
    Write-Host "🔧 Iniciando Backend (porta 3001)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 StyleWise Backend' -ForegroundColor Cyan; npm run dev"
    
    # Aguardar um pouco para o backend iniciar
    Start-Sleep -Seconds 3
    
    # Iniciar frontend em nova janela
    Write-Host "🌐 Iniciando Frontend (porta 9002)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🌐 StyleWise Frontend' -ForegroundColor Cyan; npm run dev"
    
    # Aguardar um pouco para o frontend iniciar
    Start-Sleep -Seconds 5
    
    Write-Host "🎉 StyleWise iniciado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Frontend: http://localhost:9002" -ForegroundColor Yellow
    Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Yellow
    
    # Abrir browser
    Write-Host "🌍 Abrindo browser..." -ForegroundColor Green
    Start-Process "http://localhost:9002"
}

function Stop-Services {
    Write-Host "🛑 Parando serviços StyleWise..." -ForegroundColor Red
    
    # Parar processos Node.js relacionados ao projeto
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*stylewise*" -or
        $_.CommandLine -like "*3001*" -or
        $_.CommandLine -like "*9002*"
    }
    
    foreach ($process in $nodeProcesses) {
        Write-Host "🛑 Parando processo: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
    
    Write-Host "✅ Serviços parados" -ForegroundColor Green
}

function Show-Status {
    Write-Host "📊 Status dos serviços..." -ForegroundColor Cyan
    
    # Verificar se o backend está rodando
    try {
        $backendResponse = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Backend: Online (http://localhost:3001)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Backend: Offline" -ForegroundColor Red
    }
    
    # Verificar se o frontend está rodando
    try {
        $frontendResponse = Invoke-WebRequest -Uri "http://localhost:9002" -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Frontend: Online (http://localhost:9002)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Frontend: Offline" -ForegroundColor Red
    }
}

# Executar ação baseada no parâmetro
switch ($Action.ToLower()) {
    "start" { Start-Services }
    "stop" { Stop-Services }
    "status" { Show-Status }
    "restart" { 
        Stop-Services
        Start-Sleep -Seconds 2
        Start-Services
    }
    default {
        Write-Host "Uso: .\start-stylewise.ps1 [start|stop|status|restart]" -ForegroundColor Yellow
        Write-Host "  start   - Inicia frontend e backend" -ForegroundColor White
        Write-Host "  stop    - Para todos os serviços" -ForegroundColor White
        Write-Host "  status  - Mostra status dos serviços" -ForegroundColor White
        Write-Host "  restart - Reinicia todos os serviços" -ForegroundColor White
    }
}
