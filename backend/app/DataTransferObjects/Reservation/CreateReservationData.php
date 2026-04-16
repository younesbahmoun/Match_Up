<?php

namespace App\DataTransferObjects\Reservation;

use Carbon\Carbon;

// final class CreateReservationData
// {
//     public function __construct(
//         public readonly int $terrainId,
//         public readonly Carbon $date,
//         public readonly string $startTime,   // "HH:MM:SS"
//         public readonly string $endTime,     // "HH:MM:SS"
//         public readonly int $userId,
//     ) {
//     }

//     public static function fromArray(array $data, int $userId): self
//     {
//         return new self(
//             terrainId: (int) $data['terrain_id'],
//             date: Carbon::parse($data['date']),
//             startTime: $data['start_time'],
//             endTime: $data['end_time'],
//             userId: $userId,
//         );
//     }
// }


final class CreateReservationData
{
    public function __construct(
        public readonly int $terrainId,
        public readonly string $date,
        public readonly string $startTime,
        public readonly string $endTime,
    ) {}

    public static function fromArray(array $data, int $terrainId): self
    {
        return new self(
            terrainId: $terrainId,
            // Carbon instance (object)
            date: $data['date'],
            startTime: Carbon::createFromFormat('H:i:s', $data['start_time'])->format('H:i:s'),
            endTime: Carbon::createFromFormat('H:i:s', $data['end_time'])->format('H:i:s'),
        );
    }
}