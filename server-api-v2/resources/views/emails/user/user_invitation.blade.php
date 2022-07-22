@component('mail::layout')

    <?php
        $emailData = EmailHelper::getMailTemplateProps(App\Enums\RoleType::ORGADMIN);
    ?>

    {{-- Header --}}
    @slot('header')
        @component('mail::header', ['url' => config('app.url'), 'class' => 'blue'])
            <div class="text-center">
                <img src="{{ $emailData['logo'] }}" alt="{{ $emailData['title'] }}" name="{{ $emailData['name'] }}" class="logo-header">
            </div>
        @endcomponent
    @endslot

    {{-- Body --}}
    @slot('subcopy')
        <p style="font-size: 21px;">Hello,</p>

        <p><strong>Epic</strong> has invited you to join Epic.</p>

        <p>Please complete your registration <span style="color: red; font-weight: 600;">within {{ $invitationObj->expiry_count }} days</span> of receiving this message.</p>

        @component('mail::button', ['url' => $url])
            Accept Invitation
        @endcomponent

        <p>If you received this email by mistake, simply delete it. You won't be subscribed if you don't click the confirmation link above.</p>

        <p>For more clarification, please contact : <br><a href="" target="_blank">App name</a></p>

        <p>Thanks,<br> {{ $emailData['name'] }}</p>
    @endslot

    {{-- Subcopy --}}
    @isset($subcopy)
        @slot('subcopy')
            @component('mail::subcopy')
                {{ $subcopy }}
            @endcomponent
        @endslot
    @endisset

    {{-- Footer --}}
    @slot('footer')
        @component('mail::footer', ['nomargin' => true, 'showsocial' => true])
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        @endcomponent
    @endslot

@endcomponent
