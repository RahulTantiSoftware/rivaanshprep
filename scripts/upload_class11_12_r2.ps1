$AccountId = "9c6e8d481ebdbbb383ab06fa35991a66"
$AccessKeyId = "4fe33a10f8439eb2e3386e91ecd1c4f5"
$SecretAccessKey = "aad1c8e96c9f4381d46731315ea8c550a05182c3422584f5e0e3d723159a0945"
$BucketName = "rivaanshprep"
$endpoint = "https://${AccountId}.r2.cloudflarestorage.com"

$env:AWS_ACCESS_KEY_ID = $AccessKeyId
$env:AWS_SECRET_ACCESS_KEY = $SecretAccessKey
$env:AWS_DEFAULT_REGION = "auto"

$rootDir = "D:\rivaanshprep"

$folders = @(
    "ncert_class11_physics",
    "ncert_class11_chemistry",
    "ncert_class11_math",
    "ncert_class12_physics",
    "ncert_class12_chemistry",
    "ncert_class12_math"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 UPLOADING NCERT CLASS 11 & 12 PDFs TO CLOUDFLARE R2" -ForegroundColor Cyan
Write-Host "Bucket: $BucketName | Endpoint: $endpoint" -ForegroundColor DarkGray
Write-Host "==========================================================" -ForegroundColor Cyan

$total = 0
$uploaded = 0
$skipped = 0

foreach ($folder in $folders) {
    $dirPath = Join-Path $rootDir $folder
    if (-not (Test-Path $dirPath)) {
        continue
    }

    $files = Get-ChildItem -Path $dirPath -Filter "*.pdf" -File | Where-Object { $_.Length -gt 100000 }
    Write-Host "`n📁 Processing $folder ($($files.Count) valid PDFs)..." -ForegroundColor Yellow

    foreach ($file in $files) {
        $total++
        $s3Key = "s3://$BucketName/$folder/$($file.Name)"
        $szMB = [math]::Round($file.Length / 1MB, 2)
        Write-Host "[$total] Uploading $($file.Name) ($szMB MB)..." -NoNewline

        $output = aws s3 cp $file.FullName $s3Key --endpoint-url $endpoint --region auto --only-show-errors 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host " ✅ DONE" -ForegroundColor Green
            $uploaded++
        } else {
            Write-Host " ⚠️ RETRYING..." -ForegroundColor Yellow
            Start-Sleep -Seconds 1
            $output = aws s3 cp $file.FullName $s3Key --endpoint-url $endpoint --region auto 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host " ✅ DONE" -ForegroundColor Green
                $uploaded++
            } else {
                Write-Host " ❌ FAILED: $output" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host "🎉 R2 UPLOAD COMPLETED! Total: $total | Uploaded: $uploaded" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
