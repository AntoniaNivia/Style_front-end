# Script para informações sobre o backend StyleWise
Write-Host "ℹ️  Backend StyleWise - Informações" -ForegroundColor Cyan

Write-Host "📍 O backend agora está hospedado no Render!" -ForegroundColor Green
Write-Host "🌐 URL: https://style-back-end.onrender.com" -ForegroundColor Yellow
Write-Host "" -ForegroundColor White

Write-Host "🔍 Verificando status do backend..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "https://style-back-end.onrender.com/api/health" -TimeoutSec 15 -ErrorAction Stop
    Write-Host "✅ Backend está online e respondendo!" -ForegroundColor Green
    
    # Tentar obter informações adicionais
    $healthData = $response.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($healthData) {
        Write-Host "� Status: $($healthData.status)" -ForegroundColor Cyan
        if ($healthData.timestamp) {
            Write-Host "⏰ Última resposta: $($healthData.timestamp)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "⚠️  Backend não está respondendo ou está inicializando..." -ForegroundColor Yellow
    Write-Host "� A primeira requisição pode demorar alguns segundos (cold start)" -ForegroundColor Gray
    Write-Host "� Tente novamente em alguns momentos" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor White
Write-Host "📝 Para desenvolvimento local:" -ForegroundColor Yellow
Write-Host "   - O frontend está configurado para usar o backend do Render" -ForegroundColor Gray
Write-Host "   - Todas as requisições são redirecionadas automaticamente" -ForegroundColor Gray
Write-Host "   - Não é necessário rodar o backend localmente" -ForegroundColor Gray

Write-Host "" -ForegroundColor White
Write-Host "🌐 Para testar diretamente:" -ForegroundColor Yellow
Write-Host "   https://style-back-end.onrender.com/api/health" -ForegroundColor Cyan

Write-Host "" -ForegroundColor White
Read-Host "Pressione ENTER para fechar"
