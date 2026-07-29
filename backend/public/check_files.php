<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h3>Checking Files in Backend:</h3>";

$backendDir = __DIR__ . '/../';
echo "<b>Backend Path:</b> " . realpath($backendDir) . "<br><br>";

echo "<b>Files in backend root:</b><br>";
$rootFiles = scandir($backendDir);
echo "<pre>" . print_r($rootFiles, true) . "</pre>";

if (file_exists($backendDir . 'vendor')) {
    echo "<b>Files in backend/vendor:</b><br>";
    $vendorFiles = scandir($backendDir . 'vendor');
    echo "<pre>" . print_r($vendorFiles, true) . "</pre>";
} else {
    echo "<b style='color:red;'>backend/vendor directory DOES NOT EXIST!</b><br>";
}
