Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\AFNAN\.gemini\antigravity-ide\brain\c815adaa-03bd-4860-88c6-6fdd586b283a\media__1788937400973.jpg"

function Crop-Card($x, $y, $w, $h, $outputPath) {
    $img = [System.Drawing.Image]::FromFile($srcPath)
    $cropRect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($cropRect.Width, $cropRect.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, (New-Object System.Drawing.Rectangle(0, 0, $cropRect.Width, $cropRect.Height)), $cropRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $img.Dispose()
    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host "Saved $outputPath"
}

# Y start around 332, height around 110
Crop-Card 28 332 150 110 "c:\Users\AFNAN\Desktop\M-store\public\images\cat-iphones.png"
Crop-Card 184 332 150 110 "c:\Users\AFNAN\Desktop\M-store\public\images\cat-watch.png"
Crop-Card 344 332 150 110 "c:\Users\AFNAN\Desktop\M-store\public\images\cat-airpods.png"
Crop-Card 504 332 150 110 "c:\Users\AFNAN\Desktop\M-store\public\images\cat-accessories.png"
