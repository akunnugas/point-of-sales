<?php

namespace App\Traits;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(function ($model) {
            $model->logAudit('created', [], $model->getAuditableAttributes());
        });

        static::updated(function ($model) {
            $dirty = $model->getDirty();
            $oldValues = array_intersect_key($model->getOriginal(), $dirty);
            $newValues = array_intersect_key($model->getAttributes(), $dirty);

            $model->logAudit('updated', $oldValues, $newValues);
        });

        static::deleted(function ($model) {
            $action = method_exists($model, 'isForceDeleting') && $model->isForceDeleting()
                ? 'force_deleted'
                : 'deleted';

            $model->logAudit($action, $model->getAuditableAttributes(), []);
        });

        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive(static::class))) {
            static::restored(function ($model) {
                $model->logAudit('restored', [], $model->getAuditableAttributes());
            });
        }
    }

    private function logAudit(string $action, array $oldValues, array $newValues): void
    {
        $user = Auth::user();

        AuditLog::create([
            'user_id' => $user?->id,
            'user_name' => $user?->name,
            'action' => $action,
            'auditable_type' => static::class,
            'auditable_id' => $this->getKey(),
            'old_values' => empty($oldValues) ? null : $oldValues,
            'new_values' => empty($newValues) ? null : $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }

    private function getAuditableAttributes(): array
    {
        $hidden = $this->getHidden();

        return array_diff_key($this->getAttributes(), array_flip($hidden));
    }
}
