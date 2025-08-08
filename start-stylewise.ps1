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
    Write-Host "🚀 Iniciando frontend..." -ForegroundColor Green
    Write-Host "ℹ️  Backend está hospedado no Render: https://style-back-end.onrender.com" -ForegroundColor Cyan
    
    # Verificar se a pasta do frontend existe
    if (!(Test-Path $frontendPath)) {
        Write-Host "❌ Pasta do frontend não encontrada: $frontendPath" -ForegroundColor Red
        return
    }
    
    # Verificar node_modules do frontend
    if (!(Test-Path "$frontendPath\node_modules")) {
        Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
        Set-Location $frontendPath
        npm install
    }
    
    Write-Host "✅ Dependências verificadas" -ForegroundColor Green
    
    # Verificar se o backend está acessível
    Write-Host "� Verificando backend no Render..." -ForegroundColor Cyan
    try {
        $backendResponse = Invoke-WebRequest -Uri "https://style-back-end.onrender.com/api/health" -TimeoutSec 10 -ErrorAction Stop
        Write-Host "✅ Backend no Render está online" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Backend no Render não está respondendo - primeira requisição pode demorar" -ForegroundColor Yellow
    }
    
    # Iniciar frontend em nova janela
    Write-Host "🌐 Iniciando Frontend (porta 9002)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🌐 StyleWise Frontend' -ForegroundColor Cyan; npm run dev"
    
    # Aguardar um pouco para o frontend iniciar
    Start-Sleep -Seconds 5
    
    Write-Host "🎉 StyleWise iniciado com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Frontend: http://localhost:9002" -ForegroundColor Yellow
    Write-Host "🔧 Backend: https://style-back-end.onrender.com" -ForegroundColor Yellow
    
    # Abrir browser
    Write-Host "🌍 Abrindo browser..." -ForegroundColor Green
    Start-Process "http://localhost:9002"
}

function Stop-Services {
    Write-Host "🛑 Parando frontend..." -ForegroundColor Red
    Write-Host "ℹ️  Backend está no Render (não precisa ser parado)" -ForegroundColor Cyan
    
    # Parar processos Node.js relacionados ao frontend
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*stylewise*" -or
        $_.CommandLine -like "*9002*"
    }
    
    foreach ($process in $nodeProcesses) {
        Write-Host "🛑 Parando processo: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    }
    
    Write-Host "✅ Frontend parado" -ForegroundColor Green
}

function Show-Status {
    Write-Host "📊 Status dos serviços..." -ForegroundColor Cyan
    
    # Verificar se o backend está rodando no Render
    try {
        $backendResponse = Invoke-WebRequest -Uri "https://style-back-end.onrender.com/api/health" -TimeoutSec 10 -ErrorAction Stop
        Write-Host "✅ Backend: Online (https://style-back-end.onrender.com)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Backend: Offline ou demorado (primeira requisição pode demorar)" -ForegroundColor Red
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
        Write-Host "  start   - Inicia frontend (backend está no Render)" -ForegroundColor White
        Write-Host "  stop    - Para o frontend" -ForegroundColor White
        Write-Host "  status  - Mostra status dos serviços" -ForegroundColor White
        Write-Host "  restart - Reinicia o frontend" -ForegroundColor White
    }
}
