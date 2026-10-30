@component('mail::message')
# ⭐ Vlerësim i Ri për {{ $business->name }}

@if($isAdminCopy)
**[Kopje Administrative]** Një qytetar ka lënë një vlerësim të ri.
@else
Biznesi juaj sapo mori një vlerësim të ri nga një qytetar!
@endif

---

@component('mail::panel')
**Biznesi:** {{ $business->name }}
**Vlerësuesi:** {{ $reviewer->name }}
**Vlerësimi:** {{ $stars }} ({{ $review->rating }}/5)
**Data:** {{ $submittedAt }}

@if($review->comment)
**Komenti:** *"{{ $review->comment }}"*
@endif
@endcomponent

@component('mail::button', ['url' => $businessUrl, 'color' => 'primary'])
📋 Shiko Profilin e Biznesit
@endcomponent

Me respekt,
**Sistemi Katalogu i Bizneseve – Lipjan** 🏙️
@endcomponent
