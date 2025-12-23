import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    IconArrowLeft,
    IconPrinter,
    IconExternalLink,
    IconReceipt,
} from "@tabler/icons-react";

export default function Print({ transaction }) {
    const formatPrice = (price = 0) =>
        Number(price || 0).toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        });

    const formatDateTime = (value) =>
        new Date(value).toLocaleString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const items = transaction?.details ?? [];

    const paymentLabels = {
        cash: "Tunai",
        midtrans: "Midtrans",
        xendit: "Xendit",
    };
    const paymentMethodKey = (
        transaction?.payment_method || "cash"
    ).toLowerCase();
    const paymentMethodLabel = paymentLabels[paymentMethodKey] ?? "Tunai";

    const paymentStatuses = {
        paid: "Lunas",
        pending: "Menunggu",
        failed: "Gagal",
        expired: "Kedaluwarsa",
    };
    const paymentStatusKey = (transaction?.payment_status || "").toLowerCase();
    const paymentStatusLabel =
        paymentStatuses[paymentStatusKey] ??
        (paymentMethodKey === "cash" ? "Lunas" : "Menunggu");

    const statusColors = {
        paid: "bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400",
        pending:
            "bg-warning-100 text-warning-700 dark:bg-warning-900/50 dark:text-warning-400",
        failed: "bg-danger-100 text-danger-700 dark:bg-danger-900/50 dark:text-danger-400",
        expired:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
    };
    const paymentStatusColor =
        statusColors[paymentStatusKey] ?? statusColors.paid;

    const isNonCash = paymentMethodKey !== "cash";
    const showPaymentLink = isNonCash && transaction.payment_url;

    return (
        <>
            <Head title="Invoice Penjualan" />

            <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-8 px-4 print:bg-white print:p-0">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Action Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
                        <Link
                            href={route("transactions.index")}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                            <IconArrowLeft size={18} />
                            Kembali ke kasir
                        </Link>

                        <div className="flex gap-2">
                            {showPaymentLink && (
                                <a
                                    href={transaction.payment_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-200 dark:border-primary-800 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-colors"
                                >
                                    <IconExternalLink size={18} />
                                    Buka pembayaran
                                </a>
                            )}

                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-colors"
                            >
                                <IconPrinter size={18} />
                                Cetak Invoice
                            </button>
                        </div>
                    </div>

                    {/* Invoice Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl print:shadow-none print:border-slate-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-6 py-6 text-white print:bg-slate-100 print:text-slate-900">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <IconReceipt size={24} />
                                        <span className="text-sm font-medium opacity-90 print:opacity-100">
                                            INVOICE
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold">
                                        {transaction.invoice}
                                    </p>
                                    <p className="text-sm opacity-80 print:opacity-100 mt-1">
                                        {formatDateTime(transaction.created_at)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <span
                                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${paymentStatusColor}`}
                                    >
                                        {paymentStatusLabel}
                                    </span>
                                    <p className="text-sm opacity-80 print:opacity-100 mt-2">
                                        {paymentMethodLabel}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid md:grid-cols-2 gap-6 px-6 py-6 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                    Pelanggan
                                </p>
                                <p className="text-base font-semibold text-slate-900 dark:text-white">
                                    {transaction.customer?.name ?? "Umum"}
                                </p>
                                {transaction.customer?.address && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {transaction.customer.address}
                                    </p>
                                )}
                                {transaction.customer?.phone && (
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {transaction.customer.phone}
                                    </p>
                                )}
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                                    Kasir
                                </p>
                                <p className="text-base font-semibold text-slate-900 dark:text-white">
                                    {transaction.cashier?.name ?? "-"}
                                </p>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="px-6 py-6">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Produk
                                        </th>
                                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Harga
                                        </th>
                                        <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Qty
                                        </th>
                                        <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Subtotal
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {items.map((item, index) => {
                                        const quantity = Number(item.qty) || 1;
                                        const subtotal =
                                            Number(item.price) || 0;
                                        const unitPrice = subtotal / quantity;

                                        return (
                                            <tr key={item.id ?? index}>
                                                <td className="py-3">
                                                    <p className="font-medium text-slate-900 dark:text-white">
                                                        {item.product?.title}
                                                    </p>
                                                    {item.product?.barcode && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {
                                                                item.product
                                                                    .barcode
                                                            }
                                                        </p>
                                                    )}
                                                </td>
                                                <td className="py-3 text-right text-slate-600 dark:text-slate-400">
                                                    {formatPrice(unitPrice)}
                                                </td>
                                                <td className="py-3 text-center text-slate-600 dark:text-slate-400">
                                                    {quantity}
                                                </td>
                                                <td className="py-3 text-right font-semibold text-slate-900 dark:text-white">
                                                    {formatPrice(subtotal)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-6">
                            <div className="max-w-xs ml-auto space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span>
                                        {formatPrice(
                                            transaction.grand_total +
                                                (transaction.discount || 0)
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Diskon</span>
                                    <span>
                                        - {formatPrice(transaction.discount)}
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                                    <span>Total</span>
                                    <span>
                                        {formatPrice(transaction.grand_total)}
                                    </span>
                                </div>
                                {paymentMethodKey === "cash" && (
                                    <>
                                        <div className="flex justify-between text-slate-600 dark:text-slate-400 pt-2">
                                            <span>Tunai</span>
                                            <span>
                                                {formatPrice(transaction.cash)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-success-600 dark:text-success-400 font-medium">
                                            <span>Kembali</span>
                                            <span>
                                                {formatPrice(
                                                    transaction.change
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 text-center border-t border-slate-100 dark:border-slate-800">
                            <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Terima kasih telah berbelanja
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
