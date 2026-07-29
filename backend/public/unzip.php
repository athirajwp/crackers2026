<?php
@set_time_limit(0);
@ini_set('memory_limit', '512M');
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h2>Starting Vendor ZIP Extraction...</h2>";
ob_implicit_flush(true);
if (ob_get_level()) ob_end_clean();

$zipFile = __DIR__ . '/../vendor.zip';
$extractTo = __DIR__ . '/../';

if (!file_exists($zipFile)) {
    die("<b style='color:red;'>ERROR: vendor.zip does not exist at " . $zipFile . "</b>");
}

if (!class_exists('ZipArchive')) {
    die("<b style='color:red;'>ERROR: ZipArchive extension is not enabled in PHP.</b>");
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $numFiles = $zip->numFiles;
    echo "Opened vendor.zip successfully. Total files to extract: <b>$numFiles</b><br><br>";
    
    $extracted = 0;
    for ($i = 0; $i < $numFiles; $i++) {
        $filename = $zip->getNameIndex($i);
        $zip->extractTo($extractTo, array($filename));
        $extracted++;
        
        if ($extracted % 1000 == 0 || $extracted == $numFiles) {
            echo "Extracted $extracted / $numFiles files...<br>";
            flush();
        }
    }
    
    $zip->close();
    echo "<h2 style='color:green;'>SUCCESS: All $numFiles files in vendor.zip extracted cleanly!</h2>";
} else {
    echo "<h2 style='color:red;'>ERROR: Could not open vendor.zip</h2>";
}
