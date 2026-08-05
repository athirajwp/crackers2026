<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Order;
use App\Models\Setting;
use App\Mail\AdminInvoiceMail;
use App\Mail\CustomerOrderMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendOrderEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'order:send-emails {order_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send confirmation and invoice emails for an order in the background';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $orderId = $this->argument('order_id');
        $order = Order::with('items')->find($orderId);

        if (!$order) {
            $this->error("Order #{$orderId} not found.");
            return 1;
        }

        try {
            $adminEmail = Setting::get('store_email', config('mail.from.address'));

            // Send Admin Invoice Notification Email
            if (!empty($adminEmail)) {
                try {
                    Mail::to($adminEmail)->send(new AdminInvoiceMail($order));
                    $this->info("Admin email sent to: {$adminEmail}");
                } catch (\Throwable $e) {
                    Log::error("Failed sending admin email for order #{$order->id}: " . $e->getMessage());
                }
            }

            // Send Customer Order Confirmation Email
            if (!empty($order->email)) {
                try {
                    Mail::to($order->email)->send(new CustomerOrderMail($order));
                    $this->info("Customer email sent to: {$order->email}");
                } catch (\Throwable $e) {
                    Log::error("Failed sending customer email for order #{$order->id}: " . $e->getMessage());
                }
            }

            return 0;
        } catch (\Throwable $e) {
            Log::error("Order email task failed for order #{$orderId}: " . $e->getMessage());
            return 1;
        }
    }
}
