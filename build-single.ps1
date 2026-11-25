$dir = 'C:\Users\new\Downloads\Lovable'
$html = Get-Content -LiteralPath (Join-Path $dir 'index.html') -Raw -Encoding UTF8
$css  = Get-Content -LiteralPath (Join-Path $dir 'styles.css') -Raw -Encoding UTF8
$js   = Get-Content -LiteralPath (Join-Path $dir 'app.js') -Raw -Encoding UTF8
$pwa  = Get-Content -LiteralPath (Join-Path $dir 'pwa.js') -Raw -Encoding UTF8
$i18n = Get-Content -LiteralPath (Join-Path $dir 'i18n.js') -Raw -Encoding UTF8

foreach ($chunk in @(@('app.js',$js), @('pwa.js',$pwa), @('i18n.js',$i18n))) {
  if ($chunk[1] -match '</script') { Write-Output ('WARNING: script close tag in ' + $chunk[0]) }
}

$html = $html.Replace('<link rel="stylesheet" href="styles.css" />', "<style>`n$css`n</style>")
$html = $html.Replace('<script src="app.js"></script>', "<script>`n$js`n</script>")
$html = $html.Replace('<script src="pwa.js"></script>', "<script>`n$pwa`n</script>")
$html = $html.Replace('<script src="i18n.js"></script>', "<script>`n$i18n`n</script>")

# A standalone file cannot host a manifest or service worker — strip external app refs.
$html = $html -replace '(?m)^\s*<link[^>]*id="pwa-[^"]*"[^>]*>\s*\r?\n', ''
$html = $html -replace '(?m)^\s*<meta[^>]*id="pwa-[^"]*"[^>]*>\s*\r?\n', ''
$html = $html -replace '(?s)\s*<script id="pwa-sw-register">.*?</script>', ''

[System.IO.File]::WriteAllText((Join-Path $dir 'HisabTrack.html'), $html, [System.Text.UTF8Encoding]::new($false))

# Refresh upload-ready package (PWA files included).
$tmp = Join-Path $dir 'deploy-staging'
if (Test-Path $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
New-Item -ItemType Directory -Path $tmp | Out-Null
Copy-Item -LiteralPath (Join-Path $dir 'index.html'), (Join-Path $dir 'styles.css'), (Join-Path $dir 'app.js'), (Join-Path $dir 'pwa.js'), (Join-Path $dir 'i18n.js'), (Join-Path $dir 'manifest.json'), (Join-Path $dir 'sw.js'), (Join-Path $dir 'icon.svg'), (Join-Path $dir 'icon-192.png'), (Join-Path $dir 'icon-512.png'), (Join-Path $dir 'robots.txt'), (Join-Path $dir 'sitemap.xml'), (Join-Path $dir '_redirects') -Destination $tmp

# Android APK + digital asset links for Trusted Web Activity.
$apkDir = Join-Path $dir 'hisabtrack-apk'
New-Item -ItemType Directory -Path (Join-Path $tmp 'apk') -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $apkDir 'HisabTrack.apk') -Destination (Join-Path $tmp 'apk') -Force
Copy-Item -LiteralPath (Join-Path $apkDir 'assetlinks.json') -Destination $tmp -Force
$well = Join-Path $tmp '.well-known'
New-Item -ItemType Directory -Path $well -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $apkDir 'assetlinks.json') -Destination $well -Force

$zip = Join-Path $dir 'hisabtrack-deploy.zip'
if (Test-Path $zip) { Remove-Item -LiteralPath $zip -Force }
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$fs = [System.IO.File]::Open($zip, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
$archive = New-Object System.IO.Compression.ZipArchive($fs, [System.IO.Compression.ZipArchiveMode]::Create)
foreach ($file in (Get-ChildItem -LiteralPath $tmp -Recurse -File -Force)) {
  $rel = $file.FullName.Substring($tmp.Length).TrimStart('\', '/').Replace('\', '/')
  $entry = $archive.CreateEntry($rel, [System.IO.Compression.CompressionLevel]::Optimal)
  $es = $entry.Open()
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  $es.Write($bytes, 0, $bytes.Length)
  $es.Dispose()
}
$archive.Dispose()
$fs.Dispose()
Remove-Item -LiteralPath $tmp -Recurse -Force

Write-Output ('HisabTrack.html - {0} bytes' -f (Get-Item -LiteralPath (Join-Path $dir 'HisabTrack.html')).Length)
Write-Output ('hisabtrack-deploy.zip - {0} bytes' -f (Get-Item -LiteralPath $zip).Length)
