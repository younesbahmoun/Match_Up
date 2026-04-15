<?php

namespace App\DataTransferObjects\Terrain;

use App\Enums\DayOfWeek;

final class CreateAvailabilityData
{
    public function __construct(
        // public readonly int $terrainId,
        public readonly DayOfWeek $dayOfWeek,
        public readonly string $startTime,
        public readonly string $endTime,
        // public readonly bool $isActive,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            // terrainId: (int) $data['terrain_id'],
            // dayOfWeek: DayOfWeek::from((int) $data['day_of_week']),
            dayOfWeek: DayOfWeek::tryFrom((int) $data['day_of_week']) ?? throw new \Exception('Invalid day of week'),
            startTime: $data['start_time'],
            endTime: $data['end_time'],
            // isActive: (bool) ($data['is_active'] ?? true),
        );
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            // 'terrain_id' => $this->terrainId,
            'day_of_week' => $this->dayOfWeek->value,
            'start_time' => $this->startTime,
            'end_time' => $this->endTime,
            // 'is_active' => $this->isActive,
        ];
    }
}