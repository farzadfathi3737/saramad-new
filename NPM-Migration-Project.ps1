# NPM-Migration-Project.ps1
param(
    [string]$NexusUrl = "http://94.101.178.202:8081",
    [string]$Repository = "npm-hosted",
    [string]$Username = "admin",
    [string]$Password = "6dac5a95-2ad4-4c14-911e-08870e93c1011",
    [string]$ProjectPath = ".",  # مسیر پروژه
    [switch]$IncludeDevDependencies = $false,
    [switch]$TestMode = $false
)

# لاگ فایل
$logFile = "npm-project-migration-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[${timestamp}] [${Level}] ${Message}"
    Write-Hood $logMessage
    Add-Content -Path $logFile -Value $logMessage
}

Write-Log "=== NPM Project Migration ===" "INFO"
Write-Log "Project: ${ProjectPath}" "INFO"
Write-Log "Repository: ${Repository}" "INFO"

# احراز هویت
$base64Auth = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Username}:${Password}"))
$headers = @{
    "Authorization" = "Basic ${base64Auth}"
}

# بررسی پروژه
if (-not (Test-Path $ProjectPath)) {
    Write-Log "Project path not found: ${ProjectPath}" "ERROR"
    exit 1
}

$packageJsonPath = Join-Path $ProjectPath "package.json"
$packageLockPath = Join-Path $ProjectPath "package-lock.json"

if (-not (Test-Path $packageJsonPath)) {
    Write-Log "package.json not found in project!" "ERROR"
    exit 1
}

# خواندن package.json
try {
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    Write-Log "Project: $($packageJson.name)@$($packageJson.version)" "INFO"
}
catch {
    Write-Log "Error reading package.json: $_" "ERROR"
    exit 1
}

# تابع استخراج وابستگی‌ها
function Get-ProjectDependencies {
    param([string]$ProjectDir)
    
    $dependencies = @()
    
    if (Test-Path $packageLockPath) {
        Write-Log "Using package-lock.json for dependency tree..." "INFO"
        
        try {
            $lockContent = Get-Content $packageLockPath -Raw | ConvertFrom-Json
            
            # استخراج تمام پکیج‌ها از lock file
            foreach ($key in $lockContent.packages.PSObject.Properties.Name) {
                if ($key -ne "" -and $lockContent.packages.$key.version) {
                    $cleanName = $key.Replace('node_modules/', '')
                    
                    # فیلتر کردن devDependencies اگر نیاز نباشد
                    if (-not ${IncludeDevDependencies}) {
                        $isDev = $lockContent.packages.$key.dev -or 
                                ($key -match '^node_modules/.*' -and 
                                 $key -notin @("", "node_modules") -and
                                 -not ($lockContent.dependencies -and 
                                       $lockContent.dependencies.PSObject.Properties.Name -contains $cleanName))
                        if ($isDev) { continue }
                    }
                    
                    $dependencies += [PSCustomObject]@{
                        Name = $cleanName
                        Version = $lockContent.packages.$key.version
                        Resolved = $lockContent.packages.$key.resolved
                    }
                }
            }
        }
        catch {
            Write-Log "Error parsing package-lock.json: $_" "ERROR"
        }
    }
    else {
        Write-Log "No package-lock.json found, using package.json..." "WARN"
        
        # استخراج از package.json
        if ($packageJson.dependencies) {
            foreach ($dep in $packageJson.dependencies.PSObject.Properties) {
                $dependencies += [PSCustomObject]@{
                    Name = $dep.Name
                    Version = $dep.Value
                    Resolved = $null
                }
            }
        }
        
        if (${IncludeDevDependencies} -and $packageJson.devDependencies) {
            foreach ($dep in $packageJson.devDependencies.PSObject.Properties) {
                $dependencies += [PSCustomObject]@{
                    Name = $dep.Name
                    Version = $dep.Value
                    Resolved = $null
                }
            }
        }
    }
    
    # اضافه کردن خود پروژه
    $dependencies += [PSCustomObject]@{
        Name = $packageJson.name
        Version = $packageJson.version
        Resolved = $null
    }
    
    return $dependencies | Sort-Object -Property Name -Unique
}

# تابع پیدا کردن فایل پکیج
function Find-PackageFile {
    param(
        [string]$PackageName,
        [string]$PackageVersion
    )
    
    # ۱. جستجو در کش npm
    $npmCachePaths = @(
        "${env:USERPROFILE}\.npm\_cacache\content-v2\sha512",
        "${env:USERPROFILE}\.npm\_cacache\content-v2\sha1",
        "${env:APPDATA}\npm-cache\_cacache"
    )
    
    foreach ($cachePath in $npmCachePaths) {
        if (Test-Path $cachePath) {
            # جستجوی فایل‌های metadata
            $searchPattern = "*$($PackageName.Replace('/', '-'))*$PackageVersion*"
            $possibleFiles = Get-ChildItem -Path $cachePath -Recurse -Filter $searchPattern -ErrorAction SilentlyContinue
            
            foreach ($file in $possibleFiles) {
                if ($file.Extension -eq '.tgz' -or $file.Name -match '\.tgz$') {
                    return $file.FullName
                }
            }
        }
    }
    
    # ۲. جستجو در node_modules پروژه فعلی
    $nodeModulesPath = Join-Path $ProjectPath "node_modules"
    if (Test-Path $nodeModulesPath) {
        $pkgPath = Join-Path $nodeModulesPath $PackageName
        if (Test-Path $pkgPath) {
            $pkgJsonPath = Join-Path $pkgPath "package.json"
            if (Test-Path $pkgJsonPath) {
                try {
                    $pkgData = Get-Content $pkgJsonPath -Raw | ConvertFrom-Json
                    if ($pkgData.version -eq $PackageVersion) {
                        # ساخت فایل .tgz از پکیج
                        $tempDir = Join-Path $env:TEMP "npm-pack-$($PackageName.Replace('/', '-'))"
                        New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
                        
                        Set-Location $pkgPath
                        npm pack --pack-destination $tempDir 2>&1 | Out-Null
                        Set-Location $ProjectPath
                        
                        $tgzFile = Get-ChildItem -Path $tempDir -Filter "*.tgz" | Select-Object -First 1
                        if ($tgzFile) {
                            return $tgzFile.FullName
                        }
                    }
                }
                catch {
                    # ignore
                }
            }
        }
    }
    
    return $null
}

# تست اتصال
Write-Log "Testing Nexus connection..." "DEBUG"
try {
    $statusUrl = "${NexusUrl}/service/rest/v1/status"
    $statusResponse = Invoke-RestMethod -Uri $statusUrl `
        -Method Get `
        -Headers $headers `
        -TimeoutSec 10
    
    Write-Log "✓ Nexus is online: $($statusResponse.state)" "SUCCESS"
}
catch {
    Write-Log "✗ Cannot connect to Nexus: $_" "ERROR"
    exit 1
}

# استخراج وابستگی‌ها
Write-Log "Extracting project dependencies..." "INFO"
$dependencies = Get-ProjectDependencies -ProjectDir $ProjectPath
$total = $dependencies.Count

Write-Log "Found ${total} dependencies to process" "INFO"

if ($TestMode) {
    Write-Log "=== TEST MODE ===" "INFO"
    Write-Log "Dependencies list:" "INFO"
    $dependencies | ForEach-Object {
        Write-Log "  $($_.Name)@$($_.Version)" "INFO"
    }
    exit 0
}

# آپلود دسته‌ای
Write-Log "Starting dependency upload..." "INFO"
$apiUrl = "${NexusUrl}/service/rest/v1/components?repository=${Repository}"

$counter = 0
$success = 0
$failed = 0
$skipped = 0

foreach ($dep in $dependencies) {
    $counter++
    $percent = [math]::Round(($counter / $total) * 100, 2)
    
    Write-Progress -Activity "Uploading project dependencies" `
        -Status "${counter} of ${total} (${percent}%)" `
        -PercentComplete $percent `
        -CurrentOperation "$($dep.Name)@$($dep.Version)"
    
    Write-Log "[${counter}/${total}] $($dep.Name)@$($dep.Version)" "INFO"
    
    # پیدا کردن فایل پکیج
    $packageFile = Find-PackageFile -PackageName $dep.Name -PackageVersion $dep.Version
    
    if (-not $packageFile) {
        Write-Log "  ⚠ Package file not found, skipping..." "WARN"
        $skipped++
        continue
    }
    
    Write-Log "  Found: $(Split-Path $packageFile -Leaf)" "DEBUG"
    
    # آپلود پکیج
    try {
        $response = Invoke-RestMethod -Uri $apiUrl `
            -Method Post `
            -Headers $headers `
            -ContentType "multipart/form-data" `
            -InFile $packageFile `
            -TimeoutSec 300
        
        Write-Log "  ✓ Success" "SUCCESS"
        $success++
    }
    catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 409) {
            Write-Log "  ⚠ Already exists" "WARN"
            $success++  # موفق در نظر گرفته می‌شود
        }
        else {
            Write-Log "  ✗ Error: $($_.Exception.Message)" "ERROR"
            $failed++
        }
    }
    
    # وقفه کوتاه
    if ($counter -lt ${total}) {
        Start-Sleep -Milliseconds 500
    }
}

# خلاصه نتایج
Write-Log "`n=== MIGRATION COMPLETE ===" "INFO"
Write-Log "Total dependencies: ${total}" "INFO"
Write-Log "Successfully uploaded: ${success}" $(if ($success -gt 0) { "SUCCESS" } else { "ERROR" })
Write-Log "Skipped (not found): ${skipped}" "WARN"
Write-Log "Failed: ${failed}" $(if ($failed -gt 0) { "ERROR" } else { "INFO" })

Write-Log "Full log saved to: ${logFile}" "INFO"

# تولید npmrc برای پروژه
$npmrcContent = @"
registry=${NexusUrl}/repository/${Repository}/
always-auth=true
email=user@example.com
${NexusUrl}/repository/${Repository}/:_auth=${base64Auth}
strict-ssl=false
"@

$npmrcContent | Out-File -FilePath (Join-Path $ProjectPath ".npmrc") -Encoding ASCII
Write-Log ".npmrc configuration saved to project directory" "INFO"