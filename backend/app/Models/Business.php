<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Business extends Model
{
    use HasFactory;

    protected $table = 'businesses';

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'settlement_id',
        'description',
        'short_description',
        'address',
        'phone',
        'email',
        'website',
        'latitude',
        'longitude',
        'logo_path',
        'status',
        'is_featured',
        'opening_hours',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
        'opening_hours' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function settlement(): BelongsTo
    {
        return $this->belongsTo(Settlement::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class, 'business_service')
            ->withTimestamps();
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
