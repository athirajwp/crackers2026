<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

echo "<h3>Testing Laravel View Rendering:</h3>";

try {
    require __DIR__ . '/../vendor/autoload.php';
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    
    // Create HTTP kernel to handle request
    $kernel = $app->make(\Illuminate\Contracts\Http\Kernel::class);
    
    echo "1. App booted successfully.<br>";

    // Test storage permissions
    $viewsStorage = storage_path('framework/views');
    echo "2. Storage Views Path: " . $viewsStorage . "<br>";
    echo "Is Writable: " . (is_writable($viewsStorage) ? "<b style='color:green;'>YES</b>" : "<b style='color:red;'>NO!</b>") . "<br>";

    // Try rendering view
    echo "3. Attempting view('react')->render()...<br>";
    $renderedHtml = view('react')->render();
    echo "<b style='color:green;'>SUCCESS! View rendered cleanly. First 200 chars:</b><br>";
    echo "<pre>" . htmlspecialchars(substr($renderedHtml, 0, 200)) . "</pre>";

} catch (\Throwable $e) {
    echo "<h2 style='color:red;'>EXCEPTION caught when rendering view:</h2>";
    echo "<b>Error Message:</b> " . htmlspecialchars($e->getMessage()) . "<br>";
    echo "<b>File:</b> " . htmlspecialchars($e->getFile()) . " (Line " . $e->getLine() . ")<br>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}
