@extends('emails.layout', [
    'title' => ($isApproved ? 'Aprovuar: ' : 'Njoftim: ') . 'Pretendim Pronësie – ' . $business->name,
    'preheader' => $isApproved ? 'Kërkesa juaj për administrimin e ' . $business->name . ' u aprovua!' : 'Kërkesa juaj për ' . $business->name . ' u refuzua nga administratori.'
])

@section('content')
<!-- Status Pill -->
<div style="margin-bottom: 20px;">
    @if($isApproved)
        <span style="display: inline-flex; align-items: center; gap: 6px; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            <span>✅</span> Pretendimi u Aprovua
        </span>
    @else
        <span style="display: inline-flex; align-items: center; gap: 6px; background-color: #fff1f2; border: 1px solid #fecdd3; color: #be123c; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            <span>❌</span> Kërkesa u Refuzua
        </span>
    @endif
</div>

<!-- Main Heading -->
<h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.3;">
    @if($isApproved)
        Urime! Tashmë jeni pronari zyrtar i &ldquo;{{ $business->name }}&rdquo;
    @else
        Kërkesa juaj për &ldquo;{{ $business->name }}&rdquo; nuk u pranua
    @endif
</h1>

<p style="margin: 0 0 26px 0; font-size: 15px; color: #64748b; line-height: 1.6;">
    Përshëndetje <strong>{{ $applicant->name }}</strong>, administrata e Komunës së Lipjanit ka përfunduar shqyrtimin e kërkesës suaj për verifikimin e pronësisë.
</p>

<!-- Status Information Card -->
<div style="background-color: {{ $isApproved ? '#f0fdf4' : '#fff1f2' }}; border: 1px solid {{ $isApproved ? '#bbf7d0' : '#fecdd3' }}; border-radius: 14px; padding: 22px 24px; margin-bottom: 28px;">
    @if($isApproved)
        <div style="font-size: 15px; font-weight: 700; color: #15803d; margin-bottom: 10px;">
            🎉 Çfarë mund të bëni tani:
        </div>
        <ul style="margin: 0; padding-left: 20px; color: #166534; font-size: 14px; line-height: 1.8;">
            <li>Përditësoni orarin e punës, telefonin dhe adresën e saktë.</li>
            <li>Shtoni fotografi cilësore në <strong>Galerinë e Biznesit</strong>.</li>
            <li>Menaxhoni <strong>Menynë Digjitale</strong> dhe listën e çmimeve.</li>
            <li>Postoni <strong>Oferta Ditore dhe Zbritje me Kupona</strong> për qytetarët e Lipjanit.</li>
        </ul>
    @else
        <div style="font-size: 15px; font-weight: 700; color: #9f1239; margin-bottom: 8px;">
            Arsyeja e vendimit:
        </div>
        <div style="font-size: 14px; color: #881337; line-height: 1.6;">
            {{ $claim->admin_notes ?: 'Dokumentacioni ose të dhënat e dhëna nuk mund të verifikoheshin me regjistrat e ARBK-së për këtë subjekt afarist.' }}
        </div>
        <p style="margin: 12px 0 0 0; font-size: 13px; color: #9f1239;">
            Nëse mendoni se ka ndodhur një gabim, mund të kontaktoni zyrën komunale ose të dorëzoni një kërkesë të re me dëshmi shtesë.
        </p>
    @endif
</div>

<!-- Business Summary Table -->
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
                📍 Lokacioni:
            </td>
            <td style="padding-bottom: 10px; font-size: 14px; color: #334155;">
                {{ $business->address }}
            </td>
        </tr>
        <tr>
            <td style="font-size: 13px; color: #64748b; font-weight: 600;">
                🕒 Data e Shqyrtimit:
            </td>
            <td style="font-size: 14px; color: #334155;">
                {{ $updatedAt }}
            </td>
        </tr>
    </table>
</div>

<!-- Action Button -->
<div style="text-align: center; margin-bottom: 10px;">
    @if($isApproved)
        <a href="{{ $catalogUrl }}/?business={{ $business->slug }}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35); text-align: center;">
            🚀 Menaxho Biznesin Tuaj Tani ➔
        </a>
    @else
        <a href="{{ $catalogUrl }}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; padding: 14px 34px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center;">
            🏙️ Kthehu tek Katalogu i Bizneseve ➔
        </a>
    @endif
</div>
@endsection
