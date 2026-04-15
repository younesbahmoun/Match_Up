<?php

namespace App\DataTransferObjects\Terrain;

use App\Enums\DayOfWeek;

final class UpdateAvailabilityData {
    public function __construct(
        public readonly string $startTime,
        public readonly string $endTime,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            startTime: $data['start_time'],
            endTime: $data['end_time'],
        );
    }
}

// final class UpdateAvailabilityData
// {
//     public function __construct(
//         public readonly ?DayOfWeek $dayOfWeek,
//         public readonly bool $dayOfWeekProvided,

//         public readonly ?string $startTime,
//         public readonly bool $startTimeProvided,

//         public readonly ?string $endTime,
//         public readonly bool $endTimeProvided,

//         // public readonly ?bool $isActive,
//         // public readonly bool $isActiveProvided,
//     ) {}

//     public static function fromArray(array $data): self
//     {
//         return new self(
//             // Undefined array key "day_of_week" if used ?? null
//             dayOfWeek: array_key_exists('day_of_week', $data)? DayOfWeek::from((int) $data['day_of_week']): null,
//             dayOfWeekProvided: array_key_exists('day_of_week', $data),

//             startTime: $data['start_time'] ?? null,
//             startTimeProvided: array_key_exists('start_time', $data),

//             endTime: $data['end_time'] ?? null,
//             endTimeProvided: array_key_exists('end_time', $data),

//             // isActive: array_key_exists('is_active', $data)? (bool) $data['is_active']: null,
//             // isActiveProvided: array_key_exists('is_active', $data),
//         );
//     }

//     /**
//      * @return array<string, mixed>
//      */
//     public function toArray(): array
//     {
//         $data = [];

//         if ($this->dayOfWeekProvided) {
//             $data['day_of_week'] = $this->dayOfWeek?->value;
//         }

//         if ($this->startTimeProvided) {
//             $data['start_time'] = $this->startTime;
//         }

//         if ($this->endTimeProvided) {
//             $data['end_time'] = $this->endTime;
//         }

//         // if ($this->isActiveProvided) {
//         //     $data['is_active'] = $this->isActive;
//         // }

//         return $data;
//     }
// }