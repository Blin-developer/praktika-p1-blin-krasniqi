@component('mail::message')
# {{ $isApproved ? '✅ Pretendimi juaj u Aprovua!' : '❌ Pretendimi juaj u Refuzua' }}

I/E nderuar **{{ $applicant->name }}**,

@if($isApproved)
Jemi të gëzuar t'ju njoftojmë se pretendimi juaj për biznesin **{{ $business->name }}** është **aprovuar** nga administratori.

Tani jeni pronari zyrtar i këtij biznesi në Katalogun e Bizneseve të Komunës së Lipjanit. Mund të menaxhoni profilin, fotografitë, menynë dhe ofertat direkt nga katalogu.

@component('mail::button', ['url' => $catalogUrl . '/?business=' . $business->slug, 'color' => 'success'])
🏢 Shiko Profilin e Biznesit
@endcomponent

@else
Na vjen keq, por pretendimi juaj për biznesin **{{ $business->name }}** është **refuzuar** nga administratori.

@if($claim->rejection_reason)
**Arsyeja:** {{ $claim->rejection_reason }}
@endif

Nëse mendoni se ka ndodhur një gabim ose dëshironi të dërgoni dokumentacion shtesë, ju lutemi na kontaktoni.

@component('mail::button', ['url' => $catalogUrl, 'color' => 'primary'])
🏙️ Shiko Katalogun
@endcomponent

@endif

---

@component('mail::panel')
**Biznesi:** {{ $business->name }}
**Statusi:** {{ $statusLabel }}
**Data:** {{ $updatedAt }}
@endcomponent

Me respekt,
**Sistemi Katalogu i Bizneseve – Lipjan** 🏙️
@endcomponent
