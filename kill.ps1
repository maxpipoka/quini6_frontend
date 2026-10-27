$processes = Get-Process -Name node
foreach ($p in $processes) {
    Write-Host "Stopping process $($p.Id)"
    Stop-Process -Id $p.Id -Force
}