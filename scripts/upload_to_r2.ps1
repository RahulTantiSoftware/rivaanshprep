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

$folders = @(
    "ncert_class10_math\Chapters",
    "ncert_class10_science\Chapters",
    "ncert_class10_social_science\Chapters",
    "ncert_class10_english\Chapters",
    "ncert_class10_hindi\Chapters",
    "ncert_class10_hindi_medium\Chapters"
)

foreach ($rel in $folders) {
    $localPath = Join-Path $rootDir $rel
    if (Test-Path $localPath) {
        Write-Host "📤 Syncing $rel to s3://$BucketName/Chapters/..." -ForegroundColor Yellow
        aws s3 sync "$localPath" "s3://$BucketName/Chapters/" --endpoint-url $endpoint --no-progress
    }
}

Write-Host "`n🎉 Success! All NCERT Class 10 digital book libraries have been synchronized to Cloudflare R2 bucket '$BucketName'!`n" -ForegroundColor Green
