param(
    [Parameter(Mandatory=$false)]
    [string]$AccountId,
    [Parameter(Mandatory=$false)]
    [string]$AccessKeyId,
    [Parameter(Mandatory=$false)]
    [string]$SecretAccessKey,
    [string]$BucketName = "rivaanshprep"
)

# Prompt interactively if not passed via arguments
if (-not $AccountId) {
    $AccountId = Read-Host "Enter Cloudflare Account ID"
}
if (-not $AccessKeyId) {
    $AccessKeyId = Read-Host "Enter R2 Access Key ID"
}
if (-not $SecretAccessKey) {
    $SecretAccessKey = Read-Host "Enter R2 Secret Access Key"
}

$endpoint = "https://${AccountId}.r2.cloudflarestorage.com"
$env:AWS_ACCESS_KEY_ID = $AccessKeyId
$env:AWS_SECRET_ACCESS_KEY = $SecretAccessKey
$env:AWS_DEFAULT_REGION = "auto"

Write-Host "`n🚀 Connecting to Cloudflare R2 bucket: '$BucketName'..." -ForegroundColor Cyan
Write-Host "Endpoint: $endpoint`n" -ForegroundColor DarkGray

# Verify bucket access
aws s3 ls "s3://$BucketName" --endpoint-url $endpoint

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Could not connect to R2 bucket '$BucketName'. Please verify your Account ID and API keys." -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Connection verified! Syncing NCERT Class 10 libraries to Cloudflare R2...`n" -ForegroundColor Green

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir = Split-Path -Parent $scriptDir

$subjects = @(
    "ncert_class10_math",
    "ncert_class10_science",
    "ncert_class10_social_science",
    "ncert_class10_english",
    "ncert_class10_hindi",
    "ncert_class10_hindi_medium"
)

foreach ($sub in $subjects) {
    $localPath = Join-Path $rootDir $sub
    if (Test-Path $localPath) {
        # 1. Sync to dedicated per-subject folder (e.g. s3://rivaanshprep/ncert_class10_math/)
        Write-Host "📁 Syncing $sub to s3://$BucketName/$sub/..." -ForegroundColor Cyan
        aws s3 sync "$localPath" "s3://$BucketName/$sub/" --exclude "*" --include "*.pdf" --endpoint-url $endpoint --no-progress

        # 2. Also ensure flat Chapters/ folder is synced for direct index lookup
        $chaptersPath = Join-Path $localPath "Chapters"
        if (Test-Path $chaptersPath) {
            Write-Host "📤 Syncing $sub/Chapters to s3://$BucketName/Chapters/..." -ForegroundColor Yellow
            aws s3 sync "$chaptersPath" "s3://$BucketName/Chapters/" --endpoint-url $endpoint --no-progress
        }
    }
}

Write-Host "`n🎉 Success! All NCERT Class 10 digital book libraries have been synchronized into dedicated subject folders in Cloudflare R2 bucket '$BucketName'!`n" -ForegroundColor Green
