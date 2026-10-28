<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Advertisement extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'category_id',
        'title',
        'description',
        'image_url',
        'cta_text',
        'cta_url',
        'position',
        'status',
        'start_at',
        'end_at',
        'is_active',
        'priority',
        'impressions',
        'clicks',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'is_active' => 'boolean',
        'priority' => 'integer',
        'impressions' => 'integer',
        'clicks' => 'integer',
    ];

    protected $appends = [
        'effective_status',
    ];

    /**
     * Lidhja me biznesin e promovuar.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Lidhja opsionale me kategorinë promovuese.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Llogarit statusin efektiv duke marrë parasysh orën aktuale dhe periudhën e vlefshmërisë.
     */
    public function getEffectiveStatusAttribute(): string
    {
        if (! $this->is_active || $this->status === 'disabled') {
            return 'disabled';
        }

        if ($this->status === 'draft') {
            return 'draft';
        }

        $now = now();

        if ($this->end_at && $now->greaterThan($this->end_at)) {
            return 'expired';
        }

        if ($this->start_at && $now->copy()->addMinutes(2)->lessThan($this->start_at)) {
            return 'scheduled';
        }

        return 'active';
    }

    /**
     * Scope për reklamat aktive që plotësojnë të gjitha kushtet kohore dhe të biznesit.
     *
     * Rregulla kritike:
     * - Nuk shfaqet para datës së fillimit (me 2 minuta tolerancë për sinkronizim ore).
     * - Nuk shfaqet pas datës së përfundimit.
     * - Nuk shfaqet kur është draft ose disabled.
     * - Nuk shfaqet nëse biznesi i lidhur nuk është 'published'.
     */
    public function scopeActive(Builder $query, ?string $position = null): Builder
    {
        $now = now();
        $graceStart = $now->copy()->addMinutes(2);

        $query->where('is_active', true)
            ->whereNotIn('status', ['draft', 'disabled'])
            ->where(function ($q) use ($graceStart) {
                $q->whereNull('start_at')
                  ->orWhere('start_at', '<=', $graceStart);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('end_at')
                  ->orWhere('end_at', '>=', $now);
            })
            ->whereHas('business', function ($bq) {
                $bq->where('status', 'published');
            });

        if ($position) {
            $query->where('position', $position);
        }

        return $query->orderBy('priority', 'desc')->orderBy('created_at', 'desc');
    }
}
