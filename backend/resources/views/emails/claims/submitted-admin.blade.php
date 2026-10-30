@component('mail::message')
# 🏢 Kërkesë e Re për Pretendim Biznesi

Administratori i nderuar,

Një qytetar ka dorëzuar kërkesë për të pretenduar pronësinë e biznesit të mëposhtëm.

---

@component('mail::panel')
**Biznesi:** {{ $business->name }}
**Kategoria:** {{ $business->category?->name ?? 'E pasaktësuar' }}
**Adresa:** {{ $business->address }}
@endcomponent

@component('mail::panel')
**Aplikanti:** {{ $applicant->name }}
**Email:** {{ $applicant->email }}
**Data e Dorëzimit:** {{ $submittedAt }}
@if($claim->message)
**Mesazhi i aplikantit:** {{ $claim->message }}
@endif
@endcomponent

@component('mail::button', ['url' => $adminUrl, 'color' => 'primary'])
🔍 Shiko Panelin Admin
@endcomponent

Ju lutemi shqyrtojeni kërkesën sa më shpejt dhe aprovoni ose refuzoni pronësinë.

Me respekt,
**Sistemi Katalogu i Bizneseve – Lipjan** 🏙️
@endcomponent
