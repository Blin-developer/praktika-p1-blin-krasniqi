<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Settlement extends Model
{
    use HasFactory;

    protected $table = 'settlements';

    protected $fillable = [
        'name',
        'slug',
        'postal_code',
    ];

    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }
}
