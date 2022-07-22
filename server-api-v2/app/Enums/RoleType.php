<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class RoleType extends Enum
{
    const ORGADMIN = 'EPI-OA'; //organization admin
    const ADMINPORTAL = 'EPI-AP'; //staff
    const STUDENTSPORTAL = 'EPI-SP'; // students

    const OWNER = 'owner';
    const ROOT = 'root';

    const ROLE_LEVELS = [
        'OWNER' => self::ORGADMIN,
        'ADMINISTRATION' => self::ADMINPORTAL,
        'STUDENT' => self::STUDENTSPORTAL
    ];

    const PORTAL_ROLE_LEVELS_MAP = [
        self::ORGADMIN => 'site-manager',
        self::ADMINPORTAL => 'administration',
        self::STUDENTSPORTAL => 'student'
    ];

    const ADMIN_ROLE_LEVELS_MAP = [
        self::ADMINPORTAL => 'administration',
        self::STUDENTSPORTAL => 'student'
    ];

    const ADMINISTRATIVE_ROLE_LEVELS_MAP = [
        self::STUDENTSPORTAL => 'student'
    ];
}
