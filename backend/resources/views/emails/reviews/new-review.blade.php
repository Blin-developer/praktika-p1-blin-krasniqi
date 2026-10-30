@extends('emails.layout', [
    'title' => 'Vlerësim i Ri – ' . $business->name,
    'preheader' => 'Një qytetar sapo vlerësoi biznesin ' . $business->name . ' me ' . $review->rating . ' yje.'
])

@section('content')
<!-- Header Tag Pill -->
<div style="margin-bottom: 20px;">
    <span style="display: inline-flex; align-items: center; gap: 6px; background-color: #fffbeb; border: 1px solid #fde68a; color: #b45309; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        <span>⭐</span> Vlerësim i Ri nga Qytetari
    </span>
</div>

<!-- Main Heading -->
<h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3;">
    {{ $business->name }} mori një vlerësim të ri!
</h1>

<p style="margin: 0 0 28px 0; font-size: 15px; color: #64748b; line-height: 1.6;">
    @if($isAdminCopy)
        Një qytetar ka postuar një përshtypje dhe vlerësim me yje në platformën zyrtare të bizneseve.
    @else
        Biznesi juaj sapo u vlerësua nga një konsumator në Katalogun e Komunës së Lipjanit.
    @endif
</p>

<!-- Rating Highlight Banner -->
<div style="background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 1px solid #fde68a; border-radius: 14px; padding: 20px 24px; margin-bottom: 26px; text-align: center;">
    <div style="font-size: 32px; line-height: 1; margin-bottom: 6px; letter-spacing: 3px;">
        {{ $stars }}
    </div>
    <div style="font-size: 16px; font-weight: 800; color: #92400e;">
        {{ number_format($review->rating, 1) }} nga 5 Yje
    </div>
</div>

<!-- Review Details Card -->
<div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px 24px; margin-bottom: 28px;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; width: 130px; font-weight: 600;">
                👤 Qytetari:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #0f172a; font-weight: 700;">
                {{ $reviewer->name }}
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 600;">
                🏢 Biznesi:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #0f172a; font-weight: 700;">
                {{ $business->name }}
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 600;">
                📍 Lokacioni:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #334155;">
                {{ $business->address }}
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; color: #64748b; font-weight: 600;">
                🕒 Data & Ora:
            </td>
            <td style="font-size: 14px; color: #334155;">
                {{ $submittedAt }}
            </td>
        </tr>
    </table>

    @if($review->comment)
        <!-- Comment Quote Box -->
        <div style="margin-top: 18px; padding-top: 16px; border-top: 1px dashed #cbd5e1;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 8px;">
                💬 Komenti i lënë nga qytetari:
            </div>
            <div style="background-color: #ffffff; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 10px 10px 0; font-size: 14px; color: #1e293b; font-style: italic; line-height: 1.6; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                &ldquo;{{ $review->comment }}&rdquo;
            </div>
        </div>
    @endif
</div>

<!-- Call to Action Button -->
<div style="text-align: center; margin-bottom: 10px;">
    <a href="{{ $businessUrl }}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center;">
        🔍 Shiko Profilin e Biznesit në Katalog ➔
    </a>
</div>
@endsection
