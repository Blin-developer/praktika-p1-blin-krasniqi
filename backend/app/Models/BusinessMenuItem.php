<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessMenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'business_id',
        'menu_category',
        'name',
        'description',
        'price',
        'currency',
        'image_url',
        'is_vegetarian',
        'is_popular',
        'is_available',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_vegetarian' => 'boolean',
        'is_popular' => 'boolean',
        'is_available' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }
}
