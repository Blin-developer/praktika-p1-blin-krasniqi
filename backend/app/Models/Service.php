<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    use HasFactory;

    protected $table = 'services';

    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    public function businesses(): BelongsToMany
    {
        return $this->belongsToMany(Business::class, 'business_service')
            ->withTimestamps();
    }
}
