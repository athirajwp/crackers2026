<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "Step 1: Before autoload<br>";

$autoloadPath = __DIR__ . '/../vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    die("Autoload file DOES NOT EXIST at: " . $autoloadPath);
}

echo "Step 2: Autoload file exists. Requiring it now...<br>";
require $autoloadPath;

echo "Step 3: Autoload required successfully!<br>";
