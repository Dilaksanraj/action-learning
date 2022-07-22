@component('mail::layout')

    <?php
        $emailData = EmailHelper::getMailTemplateProps(App\Enums\RoleType::ORGADMIN);
        $appsData = EmailHelper::getMailTemplatePropsAppsImage(App\Enums\RoleType::ORGADMIN);
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

        <p style="font-size: 21px;">Hey {{$user->first_name}}, <img style="width: 20px; height: 20px;" src="{{ $appsData['wave'] }}" alt="wave icon" name="wave icon"></p>

        <p style="text-align: center">Your Early Childhood Service uses <strong> Epic. </strong>  We are so excited to have you onboard!</p>

        <p style="text-align: center"><strong>Let’s get you started…</strong></p>

        <p style="text-align: center">First you will need to create a password for your account.</p>

        @component('mail::button', ['url' => $url])
            CREATE PASSWORD
        @endcomponent

        <p style="text-align: center; font-size: 24px;"> <strong>Next...</strong></p>

        <div class="text-center" style="display: flex; padding: 5px;">
            <a href="{{$appsData['urlIOS']}}" >
                <img style="width: 350px; height: 82px; padding-top: 15px" src="{{ $appsData['logoIOS'] }}" alt="{{ $appsData['titleIOS'] }}" name="{{ $appsData['name'] }}">
            </a>
            <a href="{{$appsData['urlGoogle']}}">
                <img style="width: 350px; height: 100px;" src="{{ $appsData['logoGoogle'] }}" alt="{{ $appsData['titleGoogle'] }}" name="{{ $appsData['name'] }}">
            </a>
        </div>



        <h1 style="text-align: center;"> <strong>Securely sign your child in & out of the service</strong></h1>

 

        <p style="text-align: center">
            To set up your pin code please enter your mobile number in on the login screen. When using the kiosk for the first time please enter 0000 (four zeros). You will then be asked to create your own unique pin code.
        </p>

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
