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
        <h1>Welcome to {{ $emailData['name'] }}</h1>

        <p>Hi, <strong>{{ $user->first_name }}</strong>,</p>

        <p>Thank you for choosing our online application!.</p>

        <p>Please choose the links below to start with.</p>
                <ul>
                    
                        <li>
                            <a href="" target="_blank">Epita</a>
                        </li>
                    
                </ul>

        <p>For more clarification, please contact : <br><a href="" target="_blank">APP</a></p>
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
        @component('mail::footer')
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        @endcomponent
    @endslot

@endcomponent
