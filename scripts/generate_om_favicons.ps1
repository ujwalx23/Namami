# generate_om_favicons.ps1
# Generates optimized favicon files from the Om circular icon

Add-Type -AssemblyName System.Drawing

$sourceFile = Join-Path $PSScriptRoot "..\public\om-favicon-source.png"
$publicDir  = Join-Path $PSScriptRoot "..\public"

if (-not (Test-Path $sourceFile)) {
    Write-Error "Source file not found: $sourceFile"
    exit 1
}

$source = [System.Drawing.Image]::FromFile((Resolve-Path $sourceFile))

function Save-Png($img, $size, $name) {
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $size, $size)
    $g.Dispose()
    $outPath = Join-Path $publicDir $name
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "[OK] Generated: $name ($size x $size)"
}

# Generate PNG sizes
Save-Png $source 16  "favicon-16x16.png"
Save-Png $source 32  "favicon-32x32.png"
Save-Png $source 48  "favicon-48x48.png"
Save-Png $source 32  "favicon.png"

# Generate .ico from 32x32 PNG (ICO format)
$ico32path = Join-Path $publicDir "favicon-32x32.png"
$icoPath   = Join-Path $publicDir "favicon.ico"

$ico32 = [System.Drawing.Image]::FromFile((Resolve-Path $ico32path))
$bmpIco = New-Object System.Drawing.Bitmap($ico32)

# Use MemoryStream to build .ico
$ms = New-Object System.IO.MemoryStream
$bmpIco.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
$pngBytes = $ms.ToArray()
$ms.Dispose()

# ICO file format header + directory + image data
$icoStream = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter($icoStream)

# ICO header
$writer.Write([uint16]0)       # Reserved
$writer.Write([uint16]1)       # Type: ICO
$writer.Write([uint16]1)       # Count: 1 image

# ICO directory entry
$writer.Write([byte]32)        # Width (0 = 256)
$writer.Write([byte]32)        # Height
$writer.Write([byte]0)         # Color count
$writer.Write([byte]0)         # Reserved
$writer.Write([uint16]1)       # Planes
$writer.Write([uint16]32)      # Bit count
$writer.Write([uint32]$pngBytes.Length)  # Size of image data
$writer.Write([uint32]22)      # Offset of image data (6 header + 16 dir entry)

# PNG data
$writer.Write($pngBytes)
$writer.Flush()

[System.IO.File]::WriteAllBytes($icoPath, $icoStream.ToArray())
$writer.Dispose()
$icoStream.Dispose()
$bmpIco.Dispose()
$ico32.Dispose()

Write-Host "[OK] Generated: favicon.ico (32x32 embedded PNG)"

$source.Dispose()
Write-Host "`n[DONE] All favicons generated from Om icon successfully!"
