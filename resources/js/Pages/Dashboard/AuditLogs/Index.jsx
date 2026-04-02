import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Search from "@/Components/Dashboard/Search";
import {
    IconDatabaseOff,
    IconShieldCheck,
    IconFilter,
    IconX,
    IconUser,
    IconEdit,
    IconPlus,
    IconTrash,
    IconRefresh,
    IconBolt,
} from "@tabler/icons-react";

const actionConfig = {
    created: {
        label: "Dibuat",
        className:
            "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-400",
        icon: <IconPlus size={12} />,
    },
    updated: {
        label: "Diubah",
        className:
            "bg-warning-100 text-warning-700 dark:bg-warning-900/40 dark:text-warning-400",
        icon: <IconEdit size={12} />,
    },
    deleted: {
        label: "Dihapus",
        className:
            "bg-danger-100 text-danger-700 dark:bg-danger-900/40 dark:text-danger-400",
        icon: <IconTrash size={12} />,
    },
    force_deleted: {
        label: "Hapus Permanen",
        className:
            "bg-danger-200 text-danger-800 dark:bg-danger-900/60 dark:text-danger-300",
        icon: <IconTrash size={12} />,
    },
    restored: {
        label: "Dipulihkan",
        className:
            "bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-400",
        icon: <IconRefresh size={12} />,
    },
};

const modelLabels = {
    "App\\Models\\Transaction": "Transaksi",
    "App\\Models\\Product": "Produk",
    "App\\Models\\Customer": "Pelanggan",
    "App\\Models\\Category": "Kategori",
};

function ActionBadge({ action }) {
    const config = actionConfig[action] ?? {
        label: action,
        className:
            "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
        icon: <IconBolt size={12} />,
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.icon}
            {config.label}
        </span>
    );
}

function ValuesCell({ values }) {
    if (!values || Object.keys(values).length === 0) {
        return <span className="text-slate-400 dark:text-slate-600">—</span>;
    }

    return (
        <div className="space-y-0.5 max-w-xs">
            {Object.entries(values)
                .slice(0, 3)
                .map(([key, value]) => (
                    <div key={key} className="flex gap-1 text-xs">
                        <span className="text-slate-500 dark:text-slate-400 shrink-0">
                            {key}:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 truncate font-mono">
                            {String(value ?? "null")}
                        </span>
                    </div>
                ))}
            {Object.keys(values).length > 3 && (
                <span className="text-xs text-slate-400 dark:text-slate-600">
                    +{Object.keys(values).length - 3} lainnya
                </span>
            )}
        </div>
    );
}

const defaultFilters = { search: "", action: "", model: "" };

export default function Index({ auditLogs, filters }) {
    const [filterData, setFilterData] = useState({
        ...defaultFilters,
        ...filters,
    });
    const [showFilters, setShowFilters] = useState(false);

    const handleChange = (field, value) => {
        setFilterData((prev) => ({ ...prev, [field]: value }));
    };

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(route("audit-logs.index"), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
        setShowFilters(false);
    };

    const resetFilters = () => {
        setFilterData(defaultFilters);
        router.get(route("audit-logs.index"), defaultFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const hasActiveFilters =
        filterData.action !== "" || filterData.model !== "";

    return (
        <>
            <Head title="Audit Log" />

            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Audit Log
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {auditLogs.total ?? 0} catatan aktivitas
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="w-full sm:w-80">
                    <Search
                        url={route("audit-logs.index")}
                        placeholder="Cari pengguna atau tindakan..."
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                            hasActiveFilters
                                ? "bg-primary-100 text-primary-700 border-primary-200 dark:bg-primary-900/40 dark:text-primary-400 dark:border-primary-800"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800 dark:hover:bg-slate-800"
                        }`}
                    >
                        <IconFilter size={16} />
                        Filter
                        {hasActiveFilters && (
                            <span className="w-2 h-2 rounded-full bg-primary-500" />
                        )}
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={resetFilters}
                            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Reset filter"
                        >
                            <IconX size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
                <form
                    onSubmit={applyFilters}
                    className="mb-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Tindakan
                            </label>
                            <select
                                value={filterData.action}
                                onChange={(e) =>
                                    handleChange("action", e.target.value)
                                }
                                className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Semua Tindakan</option>
                                <option value="created">Dibuat</option>
                                <option value="updated">Diubah</option>
                                <option value="deleted">Dihapus</option>
                                <option value="restored">Dipulihkan</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                                Model
                            </label>
                            <select
                                value={filterData.model}
                                onChange={(e) =>
                                    handleChange("model", e.target.value)
                                }
                                className="w-full text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Semua Model</option>
                                <option value="Transaction">Transaksi</option>
                                <option value="Product">Produk</option>
                                <option value="Customer">Pelanggan</option>
                                <option value="Category">Kategori</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                        >
                            Terapkan
                        </button>
                    </div>
                </form>
            )}

            {/* Table */}
            {auditLogs.data.length > 0 ? (
                <Table.Card title="Riwayat Aktivitas">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-10">No</Table.Th>
                                <Table.Th>Pengguna</Table.Th>
                                <Table.Th>Tindakan</Table.Th>
                                <Table.Th>Model</Table.Th>
                                <Table.Th>ID</Table.Th>
                                <Table.Th>Data Lama</Table.Th>
                                <Table.Th>Data Baru</Table.Th>
                                <Table.Th>IP Address</Table.Th>
                                <Table.Th>Waktu</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {auditLogs.data.map((log, i) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <Table.Td className="text-center">
                                        {i +
                                            1 +
                                            (auditLogs.current_page - 1) *
                                                auditLogs.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                                                <IconUser
                                                    size={14}
                                                    className="text-slate-500 dark:text-slate-400"
                                                />
                                            </div>
                                            <span className="text-sm text-slate-700 dark:text-slate-300">
                                                {log.user_name ?? "System"}
                                            </span>
                                        </div>
                                    </Table.Td>
                                    <Table.Td>
                                        <ActionBadge action={log.action} />
                                    </Table.Td>
                                    <Table.Td>
                                        <span className="text-sm text-slate-600 dark:text-slate-400">
                                            {modelLabels[log.auditable_type] ??
                                                log.auditable_type
                                                    .split("\\")
                                                    .pop()}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                            #{log.auditable_id}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <ValuesCell values={log.old_values} />
                                    </Table.Td>
                                    <Table.Td>
                                        <ValuesCell values={log.new_values} />
                                    </Table.Td>
                                    <Table.Td>
                                        <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                                            {log.ip_address ?? "—"}
                                        </span>
                                    </Table.Td>
                                    <Table.Td>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                            {log.created_at}
                                        </span>
                                    </Table.Td>
                                </tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </Table.Card>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                        <IconShieldCheck
                            size={32}
                            className="text-slate-400"
                            strokeWidth={1.5}
                        />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">
                        Belum Ada Aktivitas
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Log aktivitas akan muncul saat ada perubahan data.
                    </p>
                </div>
            )}

            {auditLogs.last_page !== 1 && (
                <Pagination links={auditLogs.links} />
            )}
        </>
    );
}

Index.layout = (page) => <DashboardLayout children={page} />;
