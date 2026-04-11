<?php

namespace App\DataTransferObjects\Terrain;

final class UpdateTerrainData
{
    public function __construct(
        public readonly ?string $name,
        public readonly bool $nameProvided,

        public readonly ?string $city,
        public readonly bool $cityProvided,

        public readonly ?string $address,
        public readonly bool $addressProvided,

        public readonly ?string $description,
        public readonly bool $descriptionProvided,

        public readonly ?int $playerCount,
        public readonly bool $playerCountProvided,

        public readonly ?float $hourPrice,
        public readonly bool $hourPriceProvided,
    ) {}

    public static function fromArray(array $data): self
    {
        // isset() vs array_key_exists() 
        // name exist and value is null => isset() return false, array_key_exists() return true
        return new self(
            name: $data['name'] ?? null,
            nameProvided: array_key_exists('name', $data),

            city: $data['city'] ?? null,
            cityProvided: array_key_exists('city', $data),

            address: $data['address'] ?? null,
            addressProvided: array_key_exists('address', $data),

            description: $data['description'] ?? null,
            descriptionProvided: array_key_exists('description', $data),

            // if: player_count exist :
                // if: player_count !== null return (int) player_count
                // if: player_count === null return null
            // else: player_count not exist return null
            playerCount: array_key_exists('player_count', $data)? ($data['player_count'] !== null ? (int) $data['player_count'] : null): null,
            playerCountProvided: array_key_exists('player_count', $data),

            hourPrice: array_key_exists('hour_price', $data)? ($data['hour_price'] !== null ? (float) $data['hour_price'] : null): null,
            hourPriceProvided: array_key_exists('hour_price', $data),
        );
    }

    public function toArray(): array
    {
        $data = [];

        if ($this->nameProvided) {
            $data['name'] = $this->name;
        }

        if ($this->cityProvided) {
            $data['city'] = $this->city;
        }

        if ($this->addressProvided) {
            $data['address'] = $this->address;
        }

        if ($this->descriptionProvided) {
            $data['description'] = $this->description;
        }

        if ($this->playerCountProvided) {
            $data['player_count'] = $this->playerCount;
        }

        if ($this->hourPriceProvided) {
            $data['hour_price'] = $this->hourPrice;
        }

        return $data;
    }
}
    //playerCount: isset($data['player_count']) ? (int) $data['player_count'] : null,
    // public function toArray(): array
    // {
    //     return array_filter([
    //         'name' => $this->name,
    //         'city' => $this->city,
    //         'address' => $this->address,
    //         'player_count' => $this->playerCount,
    //         'hour_price' => $this->hourPrice,
    //     ], static fn($value) => $value !== null);
    // }