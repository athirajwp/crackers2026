<?php
require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Http\Controllers\CheckoutController;
use Illuminate\Http\Request;

// Get a valid product ID
$product = \App\Models\Product::first();
if (!$product) {
    echo "No products found!\n";
    exit(1);
}

$request = Request::create('/api/checkout', 'POST', [
    'name' => 'Speed Test User',
    'phone' => '9876543210',
    'email' => 'test@example.com',
    'address' => '123 Speed Street',
    'city' => 'Sivakasi',
    'state' => 'Tamilnadu',
    'pincode' => '626123',
    'items' => [
        ['id' => $product->id, 'qty' => 100]
    ]
]);

$controller = new CheckoutController();

$start = microtime(true);
$response = $controller->store($request);
$elapsed = (microtime(true) - $start) * 1000;

echo "Response Status: " . $response->getStatusCode() . "\n";
echo "Response Content: " . $response->getContent() . "\n";
echo "Order Placement Execution Time: " . number_format($elapsed, 2) . " ms\n";
