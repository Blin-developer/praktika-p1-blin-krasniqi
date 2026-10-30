<?php

namespace App\Mail;

use App\Models\BusinessClaim;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClaimStatusUpdatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly BusinessClaim $claim,
    ) {}

    public function envelope(): Envelope
    {
        $statusLabel = $this->claim->status === 'approved' ? 'u Aprovua ✅' : 'u Refuzua ❌';

        return new Envelope(
            subject: '🏢 Statusi i Pretendimit tuaj ' . $statusLabel . ' – ' . $this->claim->business->name,
        );
    }

    public function content(): Content
    {
        $isApproved = $this->claim->status === 'approved';

        return new Content(
            view: 'emails.claims.status-updated',
            with: [
                'claim'       => $this->claim,
                'business'    => $this->claim->business,
                'applicant'   => $this->claim->user,
                'isApproved'  => $isApproved,
                'statusLabel' => $isApproved ? 'Aprovuar' : 'Refuzuar',
                'catalogUrl'  => config('app.url'),
                'updatedAt'   => $this->claim->updated_at->format('d/m/Y H:i'),
            ],
        );
    }
}
