<?php
define('LARAVEL_START', microtime(true));
require __DIR__ . '/../backend/vendor/autoload.php';
$app = require_once __DIR__ . '/../backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Order;
use App\Models\Setting;
use App\Mail\AdminInvoiceMail;
use Illuminate\Support\Facades\Mail;

$order = Order::with('items')->latest()->first();

$t0 = microtime(true);
$mailable = new AdminInvoiceMail($order);

$adminEmail = Setting::get('store_email', config('mail.from.address'));
echo "Sending email to {$adminEmail}...\n";
Mail::to($adminEmail)->send($mailable);
$t1 = microtime(true);

echo "Total time with current setup: " . round(($t1 - $t0) * 1000, 2) . " ms!\n";
