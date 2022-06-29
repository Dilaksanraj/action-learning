<?php

/**
 * Copyright (c) Vincent Klaiber.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @see https://github.com/vinkla/laravel-hashids
 */

return [

    /*
    |--------------------------------------------------------------------------
    | Default Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the connections below you wish to use as
    | your default connection for all work. Of course, you may use many
    | connections at once using the manager class.
    |
    */

    'default' => 'main',

    /*
    |--------------------------------------------------------------------------
    | Hashids Connections
    |--------------------------------------------------------------------------
    |
    | Here are each of the connections setup for your application. Example
    | configuration has been included, but you may add as many connections as
    | you would like.
    |
    */

    'connections' => [

        'main' => [
            'salt' => 'uTuR3OonTlrSHi3InTmpaRRDK2xkA5MBt4eXCribvzNBqZS77oAHbpSR2wikXQpSXwgFwgGsOQguNoVuwpadpmWFZsSmbGrg6u7pxyqhCLiJRjrBSkSVSd80bm3VamDU6DvemChZU6HpFWMCHcJrykUoqasJOp4I30F7DUg1KjxttuftL0dK3beQnAMVEnNtqgaCrvNCkj5DMWDaI7TyOlw8dH1EjyUpYQzcjJGUoOKcbusMOd8OB3MlSBI2Ly8MoZubuRyYQxKPsTazlZk09EZ7slLwzTLjje0UPwU0UrstXSLzKPsEwwi4SLSxvgsOzFgc7UK8cMGcb3kzRbOXPOAMPl7left3w7KqqW2cpuIg7cnKLldMvygWqpq6aTVlyhoL8bYQiT9aB47FCSQYyvghLtFd0vRZkUzworvIPWkVsbWyOqDWUCIZHNizTxLMGPwk7uRfwcDk0q2rEZSXoQHFbGurcLJCvaVO6ExZvvkASfBGeJquSDL7ZjH63aJn0h2pPCmfl1x9KIJEnX4RokTlcgWJMWVVL4a5ySx792F6AxdshHl9Nmh8DHXLzDgPM2DlMYkeVkdGjj2ExLgce1VvRpm6jNp5oF77chzIQQeK3780F7oFedpyYuNnxVeANJVXttpgm0lCsjck1fLNXkSQd1lo5BOspmrOAQxjFv53iqkBQwa0KaYDSUUAzCgwmf6NscdS7WISdzVaiIIY5G53Z3dqXUuy5AiM6QcwyjsVwWOBwbeJ8foaVBxO5Rbo6uSLaJqk0YH3Qde1VSLkTu25sf17cDtlV7XSEGMDrE3BQQAnFIif0hXtbcWvjoxbD3wjDx6Ef8LsyGpd2GIYA3PqR1lhjKidKYlYyLRA6OUpMm6cJswLmqUIzPsNfuDgEmjrKMBT25p4Hmr6aRLHQ2C50tr3gX6Q0XjicviypuTkD22lHRjtFoVvus7ilf71',
            'length' => '48',
            // 'alphabet' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        ],

        'alternative' => [
            'salt' => 'your-salt-string',
            'length' => 'your-length-integer',
            // 'alphabet' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
        ],

    ],

];
