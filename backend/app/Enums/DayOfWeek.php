<?php

namespace App\Enums;

enum DayOfWeek: int
{
    case MONDAY = 1;
    case TUESDAY = 2;
    case WEDNESDAY = 3;
    case THURSDAY = 4;
    case FRIDAY = 5;
    case SATURDAY = 6;
    case SUNDAY = 7;

    public function label(): string
    {
        // self::MONDAY->value = 1
        // self::MONDAY->name = 'MONDAY'
        // self::MONDAY->label() = 'monday'
        return match ($this) {
            self::MONDAY => 'monday',
            self::TUESDAY => 'tuesday',
            self::WEDNESDAY => 'wednesday',
            self::THURSDAY => 'thursday',
            self::FRIDAY => 'friday',
            self::SATURDAY => 'saturday',
            self::SUNDAY => 'sunday',
        };
    }
}