$baseDir = "assets/img/alaves"

# 1. Escudo
if (Test-Path "$baseDir/001_ADRENALYN_2025_26_ALAVES.webp") {
    Rename-Item -Path "$baseDir/001_ADRENALYN_2025_26_ALAVES.webp" -NewName "axl26-1.webp" -Force
}

# 2. Bis
if (Test-Path "$baseDir/001BIS_ADRENALYN_2025_26_ALAVES.webp") {
    Rename-Item -Path "$baseDir/001BIS_ADRENALYN_2025_26_ALAVES.webp" -NewName "axl26-1b.webp" -Force
}

# 3. Players (002 to 018)
# Maps to Card 2 to Card 18.
# 002 -> axl26-2.webp
# 018 -> axl26-18.webp
for ($i = 2; $i -le 18; $i++) {
    $numStr = "{0:D3}" -f $i
    $oldName = "${numStr}_ADRENALYN_2025_26_ALAVES.webp"
    
    # Handle the one weird filename for 007
    if ($i -eq 7 -and !(Test-Path "$baseDir/$oldName")) {
        $oldName = "007_ADRENALYN_2025_26_ALAVES_48564065-bfd2-405c-a406-b71dd0581551.webp"
    }

    if (Test-Path "$baseDir/$oldName") {
        Rename-Item -Path "$baseDir/$oldName" -NewName "axl26-${i}.webp" -Force
    }
}

Get-ChildItem $baseDir
