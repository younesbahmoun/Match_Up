<?php

namespace App\DataTransferObjects\Terrain;

// immutable + predictable
final class CreateTerrainData
{
    // Constructor Property Promotion php 8
    public function __construct(
        public readonly string $name,
        public readonly string $city,
        public readonly string $address,
        public readonly ?string $description,
        public readonly int $playerCount,
        public readonly float $hourPrice,
    ) {}

    public static function fromArray(array $data): self
    {
        // self => CreateTerrainData
        return new self(
            name: $data['name'],
            city: $data['city'],
            address: $data['address'],
            description: $data['description'] ?? null,
            playerCount: (int) $data['player_count'],
            hourPrice: (float) $data['hour_price'],
        );
    }
}