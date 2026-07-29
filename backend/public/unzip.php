<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$zipFile = __DIR__ . '/../vendor.zip';
$extractTo = __DIR__ . '/../';

if (!file_exists($zipFile)) {
    die("ERROR: vendor.zip does not exist at " . $zipFile);
}

if (!class_exists('ZipArchive')) {
    die("ERROR: ZipArchive extension is not enabled in PHP.");
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    echo "Extracting vendor.zip... Please wait...<br>";
    $zip->extractTo($extractTo);
    $zip->close();
    echo "<h2 style='color:green;'>SUCCESS: vendor.zip extracted successfully!</h2>";
} else {
    echo "<h2 style='color:red;'>ERROR: Failed to open vendor.zip</h2>";
}
