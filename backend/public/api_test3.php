<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h1>API Test 3</h1>";

$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    echo "<p style='color:green;'>.env exists!</p>";
} else {
    echo "<p style='color:red;'>.env DOES NOT EXIST!</p>";
}

try {
    $pdo = new PDO('mysql:host=localhost;dbname=u405695954_crackers2026', 'u405695954_crackers_db', 'Athi@123456');
    echo "<p style='color:green;'>Direct PDO MySQL Connection SUCCESSFUL!</p>";
} catch (\Exception $e) {
    echo "<p style='color:red;'>PDO Direct MySQL Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}
