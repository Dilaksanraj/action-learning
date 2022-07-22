<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Invitation;

class SendUserInvitation extends Mailable
{
    use Queueable, SerializesModels;

    public $invitationObj;
    public $url;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct(Invitation $invitation, $url)
    {
        //
        $this->invitationObj = $invitation;
        $this->url = $url;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // return $this->view('view.name');
        // return $this->markdown('emails.user.user_invitation');
        return $this->subject('Mail from EPIC')
                    ->markdown('emails.user.user_invitation');
    }
}
