# Script para iniciar o backend StyleWise
Write-Host "🚀 Iniciando Backend StyleWise..." -ForegroundColor Green

# Verificar se a pasta do backend existe
$backendPath = "C:\Users\lardo\OneDrive\Área de Trabalho\Style_front-end\stylewise-backend"

if (Test-Path $backendPath) {
    Write-Host "✅ Pasta do backend encontrada" -ForegroundColor Green
    
    # Entrar na pasta do backend
    Set-Location $backendPath
    
    # Verificar se node_modules existe
    if (!(Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
        npm install
    }
    
    # Verificar se .env existe
    if (!(Test-Path ".env")) {
        Write-Host "⚠️  Arquivo .env não encontrado!" -ForegroundColor Red
        Write-Host "📝 Copiando .env.example para .env..." -ForegroundColor Yellow
        Copy-Item ".env.example" ".env"
        Write-Host "🔧 Configure suas credenciais no arquivo .env antes de continuar!" -ForegroundColor Yellow
        Write-Host "📍 Caminho: $backendPath\.env" -ForegroundColor Cyan
        
        # Abrir o arquivo .env no notepad
        Start-Process notepad ".env"
        
        Write-Host "⏳ Pressione ENTER após configurar o .env..." -ForegroundColor Yellow
        Read-Host
    }
    
    Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
    npm run dev
} else {
    Write-Host "❌ Pasta do backend não encontrada: $backendPath" -ForegroundColor Red
    Write-Host "📁 Certifique-se de que o backend foi criado na pasta correta" -ForegroundColor Yellow
}
