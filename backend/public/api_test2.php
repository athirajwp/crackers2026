<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Step 1: Check .env file...<br>";
$envFile = __DIR__ . '/../.env';
if (!file_exists($envFile)) {
    echo "<b style='color:red;'>.env file is MISSING at $envFile</b><br>";
} else {
    echo "<b style='color:green;'>.env EXISTS!</b><br>";
    $envContent = file_get_contents($envFile);
    echo "<b>DB_DATABASE in .env:</b> ";
    if (preg_match('/DB_DATABASE=(.*)/', $envContent, $matches)) {
        echo trim($matches[1]) . "<br>";
    } else {
        echo "NOT FOUND<br>";
    }
    echo "<b>DB_USERNAME in .env:</b> ";
    if (preg_match('/DB_USERNAME=(.*)/', $envContent, $matches)) {
        echo trim($matches[1]) . "<br>";
    } else {
        echo "NOT FOUND<br>";
    }
    echo "<b>DB_PASSWORD in .env:</b> ";
    if (preg_match('/DB_PASSWORD=(.*)/', $envContent, $matches)) {
        echo (empty(trim($matches[1])) ? "EMPTY!" : "SET (Length: " . strlen(trim($matches[1])) . ")") . "<br>";
    } else {
        echo "NOT FOUND<br>";
    }
}
