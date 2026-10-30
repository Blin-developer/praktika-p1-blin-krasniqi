<?php

namespace App\Mail;

use App\Models\BusinessClaim;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClaimSubmittedAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly BusinessClaim $claim,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🏢 Kërkesë e Re: Pretendim Biznesi – ' . $this->claim->business->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.claims.submitted-admin',
            with: [
                'claim'       => $this->claim,
                'business'    => $this->claim->business,
                'applicant'   => $this->claim->user,
                'adminUrl'    => config('app.url') . '/admin',
                'submittedAt' => $this->claim->created_at->format('d/m/Y H:i'),
            ],
        );
    }
}
