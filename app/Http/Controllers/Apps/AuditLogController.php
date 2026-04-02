<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Inertia\Inertia;

class AuditLogController extends Controller
{
    public function index(): \Inertia\Response
    {
        $auditLogs = AuditLog::query()
            ->when(request('search'), function ($query) {
                $query->where(function ($q) {
                    $q->where('user_name', 'like', '%'.request('search').'%')
                        ->orWhere('action', 'like', '%'.request('search').'%')
                        ->orWhere('auditable_type', 'like', '%'.request('search').'%');
                });
            })
            ->when(request('action'), fn ($query) => $query->where('action', request('action')))
            ->when(request('model'), fn ($query) => $query->where('auditable_type', 'like', '%'.request('model').'%'))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Dashboard/AuditLogs/Index', [
            'auditLogs' => $auditLogs,
            'filters' => request()->only(['search', 'action', 'model']),
        ]);
    }
}
