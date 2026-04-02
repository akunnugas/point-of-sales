<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProfitReportExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping, WithStyles, WithTitle
{
    public function __construct(protected array $filters) {}

    public function collection()
    {
        return Transaction::query()
            ->with(['cashier:id,name', 'customer:id,name'])
            ->withSum('profits as total_profit', 'total')
            ->withSum('details as total_items', 'qty')
            ->when($this->filters['invoice'] ?? null, fn ($q, $v) => $q->where('invoice', 'like', '%'.$v.'%'))
            ->when($this->filters['cashier_id'] ?? null, fn ($q, $v) => $q->where('cashier_id', $v))
            ->when($this->filters['customer_id'] ?? null, fn ($q, $v) => $q->where('customer_id', $v))
            ->when($this->filters['start_date'] ?? null, fn ($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($this->filters['end_date'] ?? null, fn ($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->when($this->filters['payment_method'] ?? null, fn ($q, $v) => $q->where('payment_method', $v))
            ->orderByDesc('created_at')
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'Invoice',
            'Tanggal',
            'Kasir',
            'Pelanggan',
            'Item Terjual',
            'Penjualan',
            'Metode Pembayaran',
            'Profit',
        ];
    }

    public function map($transaction): array
    {
        static $index = 0;
        $index++;

        $paymentLabels = [
            'cash' => 'Tunai',
            'qris_transfer' => 'QRIS/Transfer',
            'midtrans' => 'Midtrans',
            'xendit' => 'Xendit',
        ];

        return [
            $index,
            $transaction->invoice,
            $transaction->created_at,
            $transaction->cashier?->name ?? '-',
            $transaction->customer?->name ?? '-',
            $transaction->total_items ?? 0,
            $transaction->grand_total ?? 0,
            $paymentLabels[strtolower($transaction->payment_method ?? 'cash')] ?? 'Tunai',
            $transaction->total_profit ?? 0,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }

    public function title(): string
    {
        return 'Laporan Keuntungan';
    }
}
