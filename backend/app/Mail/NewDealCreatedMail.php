<?php

namespace App\Mail;

use App\Models\BusinessDeal;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewDealCreatedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly BusinessDeal $deal,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🏷️ Ofertë e Re u Shtua – ' . $this->deal->business->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.deals.new-deal',
            with: [
                'deal'       => $this->deal,
                'business'   => $this->deal->business,
                'adminUrl'   => config('app.url') . '/admin',
                'catalogUrl' => config('app.url'),
                'createdAt'  => $this->deal->created_at->format('d/m/Y H:i'),
            ],
        );
    }
}
