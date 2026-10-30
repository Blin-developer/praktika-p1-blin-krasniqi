<?php

namespace App\Mail;

use App\Models\BusinessReview;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewReviewNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly BusinessReview $review,
        public readonly bool $isAdminCopy = false,
    ) {}

    public function envelope(): Envelope
    {
        $stars = str_repeat('⭐', (int) $this->review->rating);

        return new Envelope(
            subject: '⭐ Vlerësim i Ri ' . $stars . ' – ' . $this->review->business->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.reviews.new-review',
            with: [
                'review'        => $this->review,
                'business'      => $this->review->business,
                'reviewer'      => $this->review->user,
                'stars'         => str_repeat('⭐', (int) $this->review->rating),
                'isAdminCopy'   => $this->isAdminCopy,
                'businessUrl'   => config('app.url') . '/?business=' . $this->review->business->slug,
                'submittedAt'   => $this->review->created_at->format('d/m/Y H:i'),
            ],
        );
    }
}
