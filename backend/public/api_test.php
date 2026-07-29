<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: text/html; charset=utf-8');

echo "<h2>API & Database Connection Diagnostic</h2>";

try {
    echo "<p>1. Checking backend/.env file...</p>";
    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        echo "<b style='color:red;'>CRITICAL: backend/.env file IS MISSING!</b><br>";
    } else {
        echo "<b style='color:green;'>✓ backend/.env file exists.</b><br>";
    }

    echo "<p>2. Bootstrapping Laravel application...</p>";
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    echo "<b style='color:green;'>✓ App booted.</b><br>";

    echo "<p>3. Testing PDO MySQL Database Connection...</p>";
    $db = $app->make('db');
    $connection = $db->connection();
    echo "DB Host: " . config('database.connections.mysql.host') . "<br>";
    echo "DB Name: " . config('database.connections.mysql.database') . "<br>";
    echo "DB User: " . config('database.connections.mysql.username') . "<br>";

    $pdo = $connection->getPdo();
    echo "<b style='color:green;'>✓ PDO Connected successfully to MySQL!</b><br>";

    echo "<p>4. Querying 'settings' table...</p>";
    $settingsCount = \App\Models\Setting::count();
    echo "<b style='color:green;'>✓ Query succeeded! Total settings in DB: $settingsCount</b><br>";

    echo "<p>5. Querying 'categories' table...</p>";
    $catCount = \Illuminate\Support\Facades\DB::table('categories')->count();
    echo "<b style='color:green;'>✓ Query succeeded! Total categories in DB: $catCount</b><br>";

} catch (\Throwable $e) {
    echo "<h3 style='color:red;'>ERROR CAUSING 500 FAILURE:</h3>";
    echo "<b>Message:</b> " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<b>Code:</b> " . $e->getCode() . "<br>";
    echo "<b>File:</b> " . htmlspecialchars($e->getFile()) . ":" . $e->getLine() . "<br>";
    echo "<b>Trace:</b><pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
