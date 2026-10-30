@component('mail::message')
# 🏷️ Ofertë e Re u Shtua!

Administratori i nderuar,

Një ofertë e re ditore është shtuar në katalogun e bizneseve.

---

@component('mail::panel')
**Biznesi:** {{ $business->name }}
**Titulli i Ofertës:** {{ $deal->title }}
**Çmimi i Vjetër:** {{ $deal->original_price ? number_format($deal->original_price, 2) . ' EUR' : 'N/A' }}
**Çmimi i Ri:** {{ number_format($deal->deal_price, 2) }} EUR
@if($deal->coupon_code)
**Kodi Kupon:** `{{ $deal->coupon_code }}`
@endif
**Aktive:** {{ $deal->start_date }} → {{ $deal->end_date }}
**Data e Shtimit:** {{ $createdAt }}
@endcomponent

@component('mail::button', ['url' => $catalogUrl, 'color' => 'success'])
🏙️ Shiko Katalogun
@endcomponent

@component('mail::button', ['url' => $adminUrl, 'color' => 'primary'])
⚙️ Menaxho nga Admin Paneli
@endcomponent

Me respekt,
**Sistemi Katalogu i Bizneseve – Lipjan** 🏙️
@endcomponent
