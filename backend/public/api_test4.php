<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>API Test 4</h1>";

try {
    echo "Attempting PDO connection to localhost...<br>";
    $pdo = new PDO('mysql:host=localhost;dbname=u405695954_crackers2026', 'u405695954_crackers_db', 'Athi@123456', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    echo "<h2 style='color:green;'>SUCCESS: Connected to MySQL Database!</h2>";
} catch (\Throwable $e) {
    echo "<h2 style='color:red;'>PDO Connection Failed!</h2>";
    echo "<b>Error Message:</b> " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<b>Error Code:</b> " . $e->getCode() . "<br>";
}
