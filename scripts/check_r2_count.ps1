$env:AWS_ACCESS_KEY_ID = "4fe33a10f8439eb2e3386e91ecd1c4f5"
$env:AWS_SECRET_ACCESS_KEY = "aad1c8e96c9f4381d46731315ea8c550a05182c3422584f5e0e3d723159a0945"
$ep = "https://9c6e8d481ebdbbb383ab06fa35991a66.r2.cloudflarestorage.com"

Write-Host "Class 11 Physics:" (aws s3 ls s3://rivaanshprep/ncert_class11_physics/ --endpoint-url $ep --region auto | Measure-Object -Line).Lines
Write-Host "Class 11 Chemistry:" (aws s3 ls s3://rivaanshprep/ncert_class11_chemistry/ --endpoint-url $ep --region auto | Measure-Object -Line).Lines
Write-Host "Class 11 Math:" (aws s3 ls s3://rivaanshprep/ncert_class11_math/ --endpoint-url $ep --region auto | Measure-Object -Line).Lines
Write-Host "Class 12 Physics:" (aws s3 ls s3://rivaanshprep/ncert_class12_physics/ --endpoint-url $ep --region auto | Measure-Object -Line).Lines
Write-Host "Class 12 Chemistry:" (aws s3 ls s3://rivaanshprep/ncert_class12_chemistry/ --endpoint-url $ep --region auto | Measure-Object -Line).Lines
Write-Host "Class 12 Math:" (aws s3 ls s3://rivaanshprep/ncert_class12_math/ --endpoint-url $ep --region auto | Measure-Object -Line).Lines
