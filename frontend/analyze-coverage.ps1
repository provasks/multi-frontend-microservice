# Analyze coverage data
$lcovContent = Get-Content "coverage/lcov.info"
$totalLines = 0
$coveredLines = 0

foreach ($line in $lcovContent) {
    if ($line -match "^LF:(\d+)") {
        $totalLines += [int]$matches[1]
    }
    if ($line -match "^LH:(\d+)") {
        $coveredLines += [int]$matches[1]
    }
}

$coveragePercentage = if ($totalLines -gt 0) { [math]::Round(($coveredLines / $totalLines) * 100, 2) } else { 0 }

Write-Host "=== Coverage Analysis ===" -ForegroundColor Green
Write-Host "Total Lines: $totalLines" -ForegroundColor Yellow
Write-Host "Covered Lines: $coveredLines" -ForegroundColor Yellow
Write-Host "Coverage Percentage: $coveragePercentage%" -ForegroundColor Yellow

# Check individual component coverage
Write-Host "`n=== Component Breakdown ===" -ForegroundColor Green
$currentFile = ""
foreach ($line in $lcovContent) {
    if ($line -match "^SF:(.+)") {
        $currentFile = $matches[1]
    }
    if ($line -match "^LF:(\d+)" -and $currentFile) {
        $fileLines = [int]$matches[1]
    }
    if ($line -match "^LH:(\d+)" -and $currentFile) {
        $fileCovered = [int]$matches[1]
        $fileCoverage = if ($fileLines -gt 0) { [math]::Round(($fileCovered / $fileLines) * 100, 2) } else { 0 }
        Write-Host "$currentFile : $fileCovered/$fileLines ($fileCoverage%)" -ForegroundColor Cyan
        $currentFile = ""
    }
}
