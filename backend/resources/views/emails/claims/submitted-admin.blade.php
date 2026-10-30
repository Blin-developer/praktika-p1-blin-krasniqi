@extends('emails.layout', [
    'title' => 'Kërkesë e Re për Pretendim Biznesi – ' . $business->name,
    'preheader' => 'Aplikim i ri nga ' . $applicant->name . ' për marrjen e pronësisë së ' . $business->name
])

@section('content')
<!-- Header Tag Pill -->
<div style="margin-bottom: 20px;">
    <span style="display: inline-flex; align-items: center; gap: 6px; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
        <span>🏢</span> Kërkesë e Re Pronësie (Claim)
    </span>
</div>

<!-- Main Heading -->
<h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3;">
    Kërkesë për administrimin e &ldquo;{{ $business->name }}&rdquo;
</h1>

<p style="margin: 0 0 26px 0; font-size: 15px; color: #64748b; line-height: 1.6;">
    Një person ka dorëzuar kërkesë zyrtare për të verifikuar veten si pronar ose menaxher i këtij biznesi në komunë.
</p>

<!-- Business Highlight Banner -->
<div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 24px; margin-bottom: 24px;">
    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 6px;">
        Biznesi i Synuar
    </div>
    <div style="font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
        {{ $business->name }}
    </div>
    <div style="font-size: 13px; color: #475569;">
        📍 {{ $business->address }} &bull; Kategoria: <strong>{{ $business->category?->name ?? 'N/A' }}</strong>
    </div>
</div>

<!-- Applicant Details Card -->
<div style="background-color: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 22px 24px; margin-bottom: 28px;">
    <div style="font-size: 13px; font-weight: 800; text-transform: uppercase; color: #1e293b; letter-spacing: 0.5px; margin-bottom: 16px; display: flex; align-items: center; gap: 6px;">
        <span>📋</span> Të Dhënat e Aplikantit
    </div>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; width: 140px; font-weight: 600;">
                👤 Emri i Plotë:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #0f172a; font-weight: 700;">
                {{ $claim->full_name }}
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 600;">
                💼 Roli në Biznes:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #1d4ed8; font-weight: 700;">
                {{ $claim->business_role }}
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 600;">
                📞 Nr. Telefoni:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #0f172a; font-weight: 600;">
                <a href="tel:{{ $claim->phone }}" style="color: #2563eb; text-decoration: none;">{{ $claim->phone }}</a>
            </td>
        </tr>
        <tr>
            <td style="padding-bottom: 12px; font-size: 13px; color: #64748b; font-weight: 600;">
                ✉️ Email:
            </td>
            <td style="padding-bottom: 12px; font-size: 14px; color: #0f172a;">
                <a href="mailto:{{ $claim->email }}" style="color: #2563eb; text-decoration: none;">{{ $claim->email }}</a>
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; color: #64748b; font-weight: 600;">
                🕒 Data e Aplikimit:
            </td>
            <td style="font-size: 14px; color: #334155;">
                {{ $submittedAt }}
            </td>
        </tr>
    </table>

    @if($claim->verification_notes)
        <div style="margin-top: 18px; padding-top: 16px; border-top: 1px dashed #cbd5e1;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; margin-bottom: 8px;">
                📝 Dëshmitë / Shënimet Verifikuese (NUI / ARBK):
            </div>
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; font-size: 14px; color: #1e293b; line-height: 1.6;">
                {{ $claim->verification_notes }}
            </div>
        </div>
    @endif
</div>

<!-- Call to Action Button -->
<div style="text-align: center; margin-bottom: 10px;">
    <a href="{{ $adminUrl }}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center;">
        ⚙️ Shqyrto & Aprovo në Panelin Admin ➔
    </a>
</div>
@endsection
