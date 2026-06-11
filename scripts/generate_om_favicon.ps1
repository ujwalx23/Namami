Add-Type -AssemblyName System.Drawing

$OutputDir = "C:\Users\singh\Downloads\Namami Vindhyavasini\public"

function Create-OmFaviconSquare {
    param([int]$Size, [string]$OutputPath)
    
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    # White square background
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.FillRectangle($whiteBrush, 0, 0, $Size, $Size)

    # Gold Om symbol
    $fontSize = [int]($Size * 0.75)
    $font = $null
    foreach ($fontName in @("Noto Serif Devanagari", "Mangal", "Aparajita", "Kokila", "Arial Unicode MS", "Arial")) {
        try {
            $testFont = New-Object System.Drawing.Font($fontName, $fontSize, [System.Drawing.FontStyle]::Bold)
            if ($testFont.Name -eq $fontName) { 
                $font = $testFont
                break
            }
            $testFont.Dispose()
        } catch {}
    }
    if (-not $font) {
        $font = New-Object System.Drawing.Font("Arial", $fontSize, [System.Drawing.FontStyle]::Bold)
    }

    $omChar = [char]0x0950
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    # Dark shadow for 3D depth
    $shadowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(160, 100, 40, 0))
    $shadowRect = New-Object System.Drawing.RectangleF(($Size * 0.025), ($Size * 0.015), $Size, $Size)
    $g.DrawString($omChar, $font, $shadowBrush, $shadowRect, $sf)

    # Bright gold Om
    $goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 218, 140, 0))
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $g.DrawString($omChar, $font, $goldBrush, $rect, $sf)

    $bmp.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $font.Dispose()
    $goldBrush.Dispose()
    $shadowBrush.Dispose()
    $whiteBrush.Dispose()
    $g.Dispose()
    $bmp.Dispose()

    Write-Host "Created: $OutputPath"
}

Write-Host "Generating square Om favicons..."
Create-OmFaviconSquare 16  "$OutputDir\favicon-16x16.png"
Create-OmFaviconSquare 32  "$OutputDir\favicon-32x32.png"
Create-OmFaviconSquare 48  "$OutputDir\favicon-48x48.png"
Create-OmFaviconSquare 32  "$OutputDir\favicon.png"

# Build favicon.ico
Write-Host "Building favicon.ico..."
$pngBytes = [System.IO.File]::ReadAllBytes("$OutputDir\favicon-32x32.png")
$icoSize = $pngBytes.Length
$icoHeader = [byte[]](0, 0, 1, 0, 1, 0)
$sizeBytes = [System.BitConverter]::GetBytes($icoSize)
$offsetBytes = [System.BitConverter]::GetBytes([int]22)
$dirEntry = [byte[]](32, 32, 0, 0, 1, 0, 32, 0, $sizeBytes[0], $sizeBytes[1], $sizeBytes[2], $sizeBytes[3], $offsetBytes[0], $offsetBytes[1], $offsetBytes[2], $offsetBytes[3])
$icoFile = New-Object System.IO.FileStream("$OutputDir\favicon.ico", [System.IO.FileMode]::Create)
$icoFile.Write($icoHeader, 0, $icoHeader.Length)
$icoFile.Write($dirEntry, 0, $dirEntry.Length)
$icoFile.Write($pngBytes, 0, $pngBytes.Length)
$icoFile.Close()

Write-Host "Done! All square Om favicons generated successfully."
