type OwnerInfo = {
  id: number;
  name: string;
  email: string;
};

export type TerrainApiResponse = {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string | null;
  player_count: number;
  hour_price: string | number;
  created_at: string;
  updated_at: string;
  owner?: OwnerInfo | null;
};

export type Terrain = {
  id: string;
  name: string;
  city: string;
  address: string;
  description: string;
  playerCount: number;
  hourPrice: number;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  } | null;
  image: string;
};
