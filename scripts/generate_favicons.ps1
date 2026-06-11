param(
    [string]$InputPath = "C:\Users\singh\.gemini\antigravity-ide\brain\e3d07b38-7cc2-49f1-b107-5eb2700984a8\media__1781177879860.jpg",
    [string]$OutputDir = "c:\Users\singh\Downloads\Namami Vindhyavasini\public"
)

Add-Type -AssemblyName System.Drawing

function Resize-Circular-Image {
    param(
        [string]$Path,
        [string]$OutputPath,
        [int]$Width,
        [int]$Height
    )
    $srcImg = [System.Drawing.Image]::FromFile($Path)
    $destBmp = New-Object System.Drawing.Bitmap($Width, $Height)
    $g = [System.Drawing.Graphics]::FromImage($destBmp)
    
    # Enable transparency and high quality
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Clip to circle using unique variable name to avoid case-insensitive collision with parameter $Path
    $gPath = New-Object System.Drawing.Drawing2D.GraphicsPath
    $gPath.AddEllipse(0, 0, $Width, $Height)
    $g.SetClip($gPath)
    
    # Define source crop to remove any external black borders/margins
    # Crop about 1.5% from each boundary to ensure a clean circle edge
    $marginPercent = 0.015
    $srcW = $srcImg.Width
    $srcH = $srcImg.Height
    $cropX = [int]($srcW * $marginPercent)
    $cropY = [int]($srcH * $marginPercent)
    $cropW = $srcW - (2 * $cropX)
    $cropH = $srcH - (2 * $cropY)
    
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $Width, $Height)
    
    $g.DrawImage($srcImg, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    
    # Save as PNG
    $destBmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $gPath.Dispose()
    $g.Dispose()
    $destBmp.Dispose()
    $srcImg.Dispose()
}

# Generate PNGs
Write-Host "Generating circular favicon-16x16.png..."
Resize-Circular-Image $InputPath "$OutputDir\favicon-16x16.png" 16 16

Write-Host "Generating circular favicon-32x32.png..."
Resize-Circular-Image $InputPath "$OutputDir\favicon-32x32.png" 32 32

Write-Host "Generating circular favicon-48x48.png..."
Resize-Circular-Image $InputPath "$OutputDir\favicon-48x48.png" 48 48

Write-Host "Generating circular favicon.png..."
Resize-Circular-Image $InputPath "$OutputDir\favicon.png" 32 32

# Generate favicon.ico wrapping the 32x32 PNG bytes
Write-Host "Generating circular favicon.ico..."
$pngBytes = [System.IO.File]::ReadAllBytes("$OutputDir\favicon-32x32.png")
$icoSize = $pngBytes.Length

# ICO File Header (6 bytes):
# Reserved (2 bytes) = 0
# Type (2 bytes) = 1 (Icon)
# Image Count (2 bytes) = 1
$icoHeader = [byte[]](0, 0, 1, 0, 1, 0)

# Directory Entry (16 bytes):
# Width (1 byte) = 32
# Height (1 byte) = 32
# Color Count (1 byte) = 0
# Reserved (1 byte) = 0
# Color Planes (2 bytes) = 1, 0 (value = 1)
# Bits per pixel (2 bytes) = 32, 0 (value = 32)
# Image size in bytes (4 bytes) = little-endian size
# Image offset (4 bytes) = 22, 0, 0, 0 (value = 22 = 0x16)
$sizeBytes = [System.BitConverter]::GetBytes($icoSize)
$offsetBytes = [System.BitConverter]::GetBytes([int]22)

$dirEntry = [byte[]](
    32, 32, 0, 0,
    1, 0, 32, 0,
    $sizeBytes[0], $sizeBytes[1], $sizeBytes[2], $sizeBytes[3],
    $offsetBytes[0], $offsetBytes[1], $offsetBytes[2], $offsetBytes[3]
)

$icoFile = New-Object System.IO.FileStream("$OutputDir\favicon.ico", [System.IO.FileMode]::Create)
$icoFile.Write($icoHeader, 0, $icoHeader.Length)
$icoFile.Write($dirEntry, 0, $dirEntry.Length)
$icoFile.Write($pngBytes, 0, $pngBytes.Length)
$icoFile.Close()

Write-Host "All circular icons generated successfully!"
