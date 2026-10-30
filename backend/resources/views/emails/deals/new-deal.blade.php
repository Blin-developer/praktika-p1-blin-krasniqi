@extends('emails.layout', [
    'title' => 'Ofertë e Re – ' . $deal->title . ' (' . $business->name . ')',
    'preheader' => 'Ofertë e re nga ' . $business->name . ': ' . $deal->title . ' me çmim ' . number_format($deal->deal_price, 2) . ' EUR.'
])

@section('content')
<!-- Header Tag Pill -->
<div style="margin-bottom: 20px;">
    <span style="display: inline-flex; align-items: center; gap: 6px; background-color: #fdf2f8; border: 1px solid #fbcfe8; color: #be185d; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        <span>🏷️</span> Ofertë Ditore & Zbritje
    </span>
</div>

<!-- Main Heading -->
<h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3;">
    Ofertë e re nga &ldquo;{{ $business->name }}&rdquo;!
</h1>

<p style="margin: 0 0 26px 0; font-size: 15px; color: #64748b; line-height: 1.6;">
    Një zbritje e re u shtua në Katalogun e Komunës së Lipjanit dhe është tashmë e dukshme për të gjithë qytetarët.
</p>

<!-- Deal Visual Showcase Card -->
<div style="background: linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%); border: 1.5px solid #fbcfe8; border-radius: 16px; padding: 26px 24px; margin-bottom: 28px; text-align: center;">
    <div style="display: inline-block; background-color: #db2777; color: #ffffff; padding: 4px 14px; border-radius: 9999px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">
        {{ $deal->discount_badge }}
    </div>

    <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 10px;">
        {{ $deal->title }}
    </div>

    @if($deal->description)
        <div style="font-size: 14px; color: #475569; max-width: 480px; margin: 0 auto 16px auto; line-height: 1.5;">
            {{ $deal->description }}
        </div>
    @endif

    <!-- Pricing Box -->
    <div style="margin: 16px 0 18px 0; display: inline-flex; align-items: baseline; gap: 12px; background: #ffffff; padding: 10px 24px; border-radius: 12px; border: 1px solid #fce7f3; box-shadow: 0 2px 6px rgba(190, 24, 93, 0.08);">
        @if($deal->original_price)
            <span style="font-size: 16px; color: #94a3b8; text-decoration: line-through; font-weight: 600;">
                {{ number_format($deal->original_price, 2) }} €
            </span>
        @endif
        <span style="font-size: 26px; font-weight: 900; color: #be185d;">
            {{ number_format($deal->deal_price, 2) }} €
        </span>
    </div>

    @if($deal->coupon_code)
        <div style="margin-top: 12px;">
            <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #9d174d; letter-spacing: 0.5px; margin-bottom: 6px;">
                🎟️ Kodi i Kuponit për Zbritje:
            </div>
            <div style="display: inline-block; background-color: #ffffff; border: 2px dashed #f43f5e; color: #e11d48; font-family: monospace; font-size: 18px; font-weight: 800; padding: 8px 20px; border-radius: 8px; letter-spacing: 2px;">
                {{ $deal->coupon_code }}
            </div>
        </div>
    @endif
</div>

<!-- Details Summary Table -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 24px; margin-bottom: 28px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; width: 130px; font-weight: 600;">
                🏢 Biznesi:
            </td>
            <td style="padding-bottom: 10px; font-size: 14px; color: #0f172a; font-weight: 700;">
                {{ $business->name }}
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 10px; font-size: 13px; color: #64748b; font-weight: 600;">
                📅 E Vlefshme:
            </td>
            <td style="padding-bottom: 10px; font-size: 14px; color: #334155;">
                {{ $deal->start_date ?: 'Menjëherë' }} deri më {{ $deal->end_date ?: 'Pa afat' }}
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; color: #64748b; font-weight: 600;">
                🕒 Publikuar më:
            </td>
            <td style="font-size: 14px; color: #334155;">
                {{ $createdAt }}
            </td>
        </tr>
    </table>
</div>

<!-- Call to Action Buttons -->
<div style="text-align: center; margin-bottom: 10px;">
    <a href="{{ $catalogUrl }}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #db2777 0%, #be185d 100%); color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(219, 39, 119, 0.35); text-align: center; margin-right: 8px; margin-bottom: 8px;">
        🏷️ Shiko Ofertat në Faqen Kryesore ➔
    </a>
</div>
@endsection
