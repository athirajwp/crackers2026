<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h1>Laravel Diagnostic Script</h1>";

try {
    echo "<p>1. Checking vendor autoload...</p>";
    if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
        die("<b style='color:red;'>vendor/autoload.php missing!</b>");
    }
    require __DIR__ . '/../vendor/autoload.php';
    echo "<p style='color:green;'>✓ Vendor loaded successfully.</p>";

    echo "<p>2. Checking .env file...</p>";
    if (!file_exists(__DIR__ . '/../.env')) {
        die("<b style='color:red;'>.env file is missing in backend directory!</b>");
    }
    echo "<p style='color:green;'>✓ .env file exists.</p>";

    echo "<p>3. Bootstrapping Laravel application...</p>";
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    echo "<p style='color:green;'>✓ Application bootstrapped.</p>";

    echo "<p>4. Testing Database Connection...</p>";
    $db = $app->make('db');
    $pdo = $db->connection()->getPdo();
    echo "<p style='color:green;'>✓ Connected to DB: " . $db->connection()->getDatabaseName() . "</p>";

    echo "<p>5. Testing Settings Table Query...</p>";
    $settings = \App\Models\Setting::all();
    echo "<p style='color:green;'>✓ Settings query succeeded. Total settings: " . count($settings) . "</p>";

    echo "<p>6. Capturing Request /api/admin/settings...</p>";
    $request = \Illuminate\Http\Request::create('/api/admin/settings', 'GET');
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    $response = $kernel->handle($request);

    echo "<p>Status Code: " . $response->getStatusCode() . "</p>";
    echo "<pre>" . htmlspecialchars(substr($response->getContent(), 0, 2000)) . "</pre>";

} catch (\Throwable $e) {
    echo "<h2 style='color:red;'>FATAL ERROR ENCOUNTERED:</h2>";
    echo "<pre><b>Message:</b> " . htmlspecialchars($e->getMessage()) . "\n";
    echo "<b>File:</b> " . htmlspecialchars($e->getFile()) . ":" . $e->getLine() . "\n";
    echo "<b>Trace:</b>\n" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
