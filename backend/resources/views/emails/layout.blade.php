<!DOCTYPE html>
<html lang="sq">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{ $title ?? 'Katalogu i Bizneseve – Komuna e Lipjanit' }}</title>
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
        @media only screen and (max-width: 620px) {
            .email-container { width: 100% !important; padding: 12px !important; }
            .card-body { padding: 24px 18px !important; }
            .mobile-full { width: 100% !important; display: block !important; }
            .badge-item { display: block !important; margin-bottom: 8px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; -webkit-font-smoothing: antialiased;">
    <!-- Preheader preview text -->
    <div style="display: none; font-size: 1px; color: #f1f5f9; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        {{ $preheader ?? 'Njoftim zyrtar nga Katalogu i Bizneseve të Komunës së Lipjanit' }}
    </div>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f1f5f9; padding: 32px 0 48px 0;">
        <tr>
            <td align="center">
                <!-- Main Email Container -->
                <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; max-width: 600px; margin: 0 auto;">
                    
                    <!-- Brand Top Header -->
                    <tr>
                        <td align="center" style="padding: 0 0 20px 0;">
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        <div style="display: inline-flex; align-items: center; gap: 10px; background: #ffffff; padding: 8px 18px; border-radius: 9999px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);">
                                            <span style="font-size: 18px;">🏙️</span>
                                            <span style="font-size: 13px; font-weight: 700; color: #0f172a; letter-spacing: 0.5px; text-transform: uppercase;">
                                                Komuna e Lipjanit
                                            </span>
                                            <span style="background: #eff6ff; color: #1d4ed8; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; text-transform: uppercase;">
                                                Zyrtare
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content Card -->
                    <tr>
                        <td>
                            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #ffffff; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);">
                                
                                <!-- Top Accent Decorative Bar -->
                                <tr>
                                    <td height="6" style="background: linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%); line-height: 6px; font-size: 6px;">&nbsp;</td>
                                </tr>

                                <!-- Inner Content Area -->
                                <tr>
                                    <td class="card-body" style="padding: 38px 36px 36px 36px;">
                                        @yield('content')
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <!-- Modern Email Footer -->
                    <tr>
                        <td style="padding: 28px 20px 0 20px; text-align: center;">
                            <p style="margin: 0 0 10px 0; font-size: 12px; line-height: 18px; color: #64748b;">
                                Ky është një njoftim i automatizuar nga <strong>Portali Zyrtar i Bizneseve të Komunës së Lipjanit</strong>.<br>
                                Ju lutemi mos iu përgjigjni drejtpërdrejt këtij emaili.
                            </p>
                            <p style="margin: 0 0 14px 0; font-size: 12px; color: #94a3b8;">
                                <a href="{{ config('app.url') }}" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">Katalogu i Bizneseve</a>
                                &nbsp;&bull;&nbsp;
                                <a href="{{ config('app.url') }}/?view=map" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">Harta Interaktive</a>
                                &nbsp;&bull;&nbsp;
                                <a href="{{ config('app.url') }}/admin" target="_blank" style="color: #2563eb; text-decoration: none; font-weight: 600;">Paneli Administrativ</a>
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                                &copy; {{ date('Y') }} Komuna e Lipjanit, Republika e Kosovës. Të gjitha të drejtat të rezervuara.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>

