Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\AFNAN\.gemini\antigravity-ide\brain\c815adaa-03bd-4860-88c6-6fdd586b283a\media__1788941957630.png"
$img = [System.Drawing.Image]::FromFile($srcPath)

function Crop-Section($x, $y, $w, $h, $outputPath) {
    $cropRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($cropRect.Width, $cropRect.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $cropRect.Width, $cropRect.Height)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved $outputPath"
}

# Product Stage Images (Y=146 to Y=338, H=192)
Crop-Section 33 146 229 192 "c:\Users\AFNAN\Desktop\M-store\public\images\prod-iphone15pro.png"
Crop-Section 272 146 229 192 "c:\Users\AFNAN\Desktop\M-store\public\images\prod-iphone15.png"
Crop-Section 511 146 229 192 "c:\Users\AFNAN\Desktop\M-store\public\images\prod-iphone14pro.png"
Crop-Section 750 146 229 192 "c:\Users\AFNAN\Desktop\M-store\public\images\prod-iphone14.png"

# Header Banner with gold camera lens graphic (X=500 to 1024, Y=0 to 150)
Crop-Section 450 0 574 150 "c:\Users\AFNAN\Desktop\M-store\public\images\featured-header-banner.png"

$img.Dispose()
