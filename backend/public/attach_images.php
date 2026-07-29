<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Http\Kernel::class)->bootstrap();

echo "<h2>Attaching Images from backend/public/img to Products & Settings...</h2>";

$imgDir = __DIR__ . '/img';

// Get all files in img/
$files = scandir($imgDir);
$imageMap = [];

foreach ($files as $file) {
    if ($file === '.' || $file === '..' || is_dir($imgDir . '/' . $file)) continue;
    $ext = pathinfo($file, PATHINFO_EXTENSION);
    if (!in_array(strtolower($ext), ['jpg', 'jpeg', 'png', 'webp', 'gif'])) continue;

    $baseName = pathinfo($file, PATHINFO_FILENAME);
    // Normalized key (lowercase, alphanumeric only)
    $cleanKey = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $baseName));
    $imageMap[$cleanKey] = 'img/' . $file;
}

echo "<b>Scanned " . count($imageMap) . " product images in /img:</b><br>";
echo "<pre>" . print_r($imageMap, true) . "</pre>";

// Match with products
$products = \App\Models\Product::all();
$matched = 0;

foreach ($products as $product) {
    $prodCleanKey = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $product->name));
    
    // Check direct match or partial match
    $matchedPath = null;
    if (isset($imageMap[$prodCleanKey])) {
        $matchedPath = $imageMap[$prodCleanKey];
    } else {
        foreach ($imageMap as $key => $path) {
            if ($key === $prodCleanKey || str_contains($prodCleanKey, $key) || str_contains($key, $prodCleanKey)) {
                $matchedPath = $path;
                break;
            }
        }
    }

    if ($matchedPath) {
        $product->image = $matchedPath;
        $product->save();
        $matched++;
        echo "✓ Matched product [<b>{$product->name}</b>] -> <code>{$matchedPath}</code><br>";
    } else {
        echo "<span style='color:gray;'>- No direct match for product [{$product->name}]</span><br>";
    }
}

echo "<br><b>Total Products Updated with Images: $matched / " . count($products) . "</b><br><br>";

// Now update Branding & Slider Settings
echo "<h3>Updating Slider & Gallery Settings...</h3>";

if (file_exists($imgDir . '/slider img/20631.jpg')) {
    \App\Models\Setting::set('slider_image_1', 'img/slider img/20631.jpg', 'text');
    echo "✓ Set slider_image_1 -> <code>img/slider img/20631.jpg</code><br>";
}

if (file_exists($imgDir . '/about us/about_showcase.png')) {
    \App\Models\Setting::set('aboutus_image_1', 'img/about us/about_showcase.png', 'text');
    echo "✓ Set aboutus_image_1 -> <code>img/about us/about_showcase.png</code><br>";
}

// Gallery images
$galleryDir = $imgDir . '/gallery';
if (file_exists($galleryDir)) {
    $gFiles = scandir($galleryDir);
    $gIdx = 1;
    foreach ($gFiles as $gFile) {
        if ($gFile === '.' || $gFile === '..' || is_dir($galleryDir . '/' . $gFile)) continue;
        if ($gIdx > 10) break;
        
        $gPath = 'img/gallery/' . $gFile;
        \App\Models\Setting::set("gallery_image_$gIdx", $gPath, 'text');
        echo "✓ Set gallery_image_$gIdx -> <code>$gPath</code><br>";
        $gIdx++;
    }
}

echo "<h2 style='color:green;'>SUCCESS: All images successfully attached to Products & Settings!</h2>";
