<?php

namespace Tests\Feature\Reports;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Profit;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class ExcelExportTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (['reports-access', 'profits-access', 'transactions-access'] as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'web']);
        }

        $this->admin = User::factory()->create();
        $this->admin->givePermissionTo(['reports-access', 'profits-access', 'transactions-access']);
    }

    public function test_sales_report_excel_export_returns_download(): void
    {
        Excel::fake();

        $this->actingAs($this->admin)
            ->get(route('reports.sales.export'))
            ->assertOk();

        Excel::assertDownloaded('laporan-penjualan-'.now()->format('Y-m-d').'.xlsx');
    }

    public function test_profit_report_excel_export_returns_download(): void
    {
        Excel::fake();

        $this->actingAs($this->admin)
            ->get(route('reports.profits.export'))
            ->assertOk();

        Excel::assertDownloaded('laporan-keuntungan-'.now()->format('Y-m-d').'.xlsx');
    }

    public function test_transaction_history_excel_export_returns_download(): void
    {
        Excel::fake();

        $this->actingAs($this->admin)
            ->get(route('transactions.history.export'))
            ->assertOk();

        Excel::assertDownloaded('riwayat-transaksi-'.now()->format('Y-m-d').'.xlsx');
    }

    public function test_sales_export_applies_filters(): void
    {
        Excel::fake();

        $this->actingAs($this->admin)
            ->get(route('reports.sales.export', [
                'start_date' => '2024-01-01',
                'end_date' => '2024-12-31',
                'invoice' => 'TRX-001',
            ]))
            ->assertOk();

        Excel::assertDownloaded('laporan-penjualan-'.now()->format('Y-m-d').'.xlsx');
    }

    public function test_unauthenticated_user_cannot_export_sales(): void
    {
        $this->get(route('reports.sales.export'))
            ->assertRedirect(route('login'));
    }

    public function test_unauthenticated_user_cannot_export_profits(): void
    {
        $this->get(route('reports.profits.export'))
            ->assertRedirect(route('login'));
    }

    public function test_unauthenticated_user_cannot_export_history(): void
    {
        $this->get(route('transactions.history.export'))
            ->assertRedirect(route('login'));
    }

    public function test_user_without_permission_cannot_export_sales(): void
    {
        $user = User::factory()->create();

        // The app redirects back with an error when permission is denied
        $this->actingAs($user)
            ->get(route('reports.sales.export'))
            ->assertRedirect();
    }

    public function test_sales_export_contains_data_from_transactions(): void
    {
        Excel::fake();

        $transaction = $this->createTransactionWithProfit();

        $this->actingAs($this->admin)
            ->get(route('reports.sales.export'))
            ->assertOk();

        Excel::assertDownloaded(
            'laporan-penjualan-'.now()->format('Y-m-d').'.xlsx',
            function (\App\Exports\SalesReportExport $export) use ($transaction) {
                return $export->collection()->contains('id', $transaction->id);
            }
        );
    }

    protected function createTransactionWithProfit(): Transaction
    {
        $category = Category::create([
            'name' => 'Test',
            'description' => 'Test',
            'image' => 'test.png',
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'image' => 'test.png',
            'barcode' => 'BRCD-'.Str::upper(Str::random(10)),
            'title' => 'Test Product',
            'description' => 'Test',
            'buy_price' => 10000,
            'sell_price' => 15000,
            'stock' => 10,
        ]);

        $transaction = Transaction::create([
            'cashier_id' => $this->admin->id,
            'invoice' => 'TRX-TEST-001',
            'cash' => 15000,
            'change' => 0,
            'discount' => 0,
            'grand_total' => 15000,
            'payment_method' => 'cash',
            'payment_status' => 'success',
        ]);

        TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'product_id' => $product->id,
            'qty' => 1,
            'price' => 15000,
            'buy_price' => 10000,
        ]);

        Profit::create([
            'transaction_id' => $transaction->id,
            'total' => 5000,
        ]);

        return $transaction;
    }
}
