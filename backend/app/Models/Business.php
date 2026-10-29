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
        'owner_id',
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

    protected $appends = [
        'has_verified_location',
        'location_status',
        'reviews_avg_rating',
        'reviews_count',
        'is_claimed',
    ];

    public function getIsClaimedAttribute(): bool
    {
        return !is_null($this->owner_id);
    }

    public function getHasVerifiedLocationAttribute(): bool
    {
        return !is_null($this->latitude) && !is_null($this->longitude);
    }

    public function getLocationStatusAttribute(): string
    {
        return $this->getHasVerifiedLocationAttribute() ? 'verified' : 'pending_verification';
    }

    public function getReviewsAvgRatingAttribute(): ?float
    {
        if (array_key_exists('reviews_avg_rating', $this->attributes)) {
            return $this->attributes['reviews_avg_rating'] !== null
                ? round((float) $this->attributes['reviews_avg_rating'], 1)
                : null;
        }

        if ($this->relationLoaded('reviews')) {
            $avg = $this->reviews->avg('rating');
            return $avg ? round((float) $avg, 1) : null;
        }

        $avg = $this->reviews()->avg('rating');
        return $avg ? round((float) $avg, 1) : null;
    }

    public function getReviewsCountAttribute(): int
    {
        if (array_key_exists('reviews_count', $this->attributes)) {
            return (int) $this->attributes['reviews_count'];
        }

        if ($this->relationLoaded('reviews')) {
            return $this->reviews->count();
        }

        return $this->reviews()->count();
    }

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

    public function advertisements(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Advertisement::class);
    }

    public function favoritedBy(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_favorites')->withTimestamps();
    }

    public function reviews(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BusinessReview::class)->latest();
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function claims(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(BusinessClaim::class)->latest();
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
