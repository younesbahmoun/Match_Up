import {
  buildAuthHeaders,
  buildOwnerApiUrl,
  parseJsonResponse,
  readApiError,
} from "@/features/owner/services/api";
import type { Terrain, TerrainApiResponse } from "@/features/owner/types/terrain";

type TerrainCollectionResponse = {
  data?: TerrainApiResponse[];
};

type TerrainItemResponse = {
  data?: TerrainApiResponse;
};

export type TerrainMutationInput = {
  name: string;
  city: string;
  address: string;
  description: string;
  player_count: number;
  hour_price: number;
};

const terrainImages = [
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486286701208-1d58e9338013?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80",
];

function mapTerrain(apiTerrain: TerrainApiResponse, index: number): Terrain {
  const imageIndex = Number(apiTerrain.id) % terrainImages.length;

  return {
    id: String(apiTerrain.id),
    name: apiTerrain.name,
    city: apiTerrain.city,
    address: apiTerrain.address,
    description: apiTerrain.description ?? "",
    playerCount: apiTerrain.player_count,
    hourPrice: Number(apiTerrain.hour_price),
    createdAt: apiTerrain.created_at,
    updatedAt: apiTerrain.updated_at,
    owner: apiTerrain.owner
      ? {
          id: String(apiTerrain.owner.id),
          name: apiTerrain.owner.name,
          email: apiTerrain.owner.email,
        }
      : null,
    image: terrainImages[Math.abs(imageIndex)],
  };
}

function readTerrainCollection(payload: TerrainCollectionResponse | TerrainApiResponse[] | null) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data ?? [];
}

function readTerrainItem(payload: TerrainItemResponse | TerrainApiResponse | null) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  return payload as TerrainApiResponse;
}

export async function getOwnerTerrains(): Promise<Terrain[]> {
  const response = await fetch(buildOwnerApiUrl("/owner/terrains"), {
    headers: buildAuthHeaders(),
  });

  const payload = await parseJsonResponse<TerrainCollectionResponse | TerrainApiResponse[]>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not load terrains."));
  }

  return readTerrainCollection(payload).map((terrain, index) =>
    mapTerrain(terrain, index)
  );
}

export async function getOwnerTerrainById(terrainId: string): Promise<Terrain> {
  const response = await fetch(buildOwnerApiUrl(`/owner/terrains/${terrainId}`), {
    headers: buildAuthHeaders(),
  });

  const payload = await parseJsonResponse<TerrainItemResponse | TerrainApiResponse>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not load terrain details."));
  }

  const terrain = readTerrainItem(payload);

  if (!terrain) {
    throw new Error("Invalid terrain details response.");
  }

  return mapTerrain(terrain, 0);
}

export async function createOwnerTerrain(
  input: TerrainMutationInput
): Promise<Terrain> {
  const response = await fetch(buildOwnerApiUrl("/owner/terrains"), {
    method: "POST",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });

  const payload = await parseJsonResponse<TerrainItemResponse | TerrainApiResponse>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not create terrain."));
  }

  const terrain = readTerrainItem(payload);

  if (!terrain) {
    throw new Error("Invalid create terrain response.");
  }

  return mapTerrain(terrain, 0);
}

export async function updateOwnerTerrain(
  terrainId: string,
  input: TerrainMutationInput
): Promise<Terrain> {
  const response = await fetch(buildOwnerApiUrl(`/owner/terrains/${terrainId}`), {
    method: "PATCH",
    headers: buildAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(input),
  });

  const payload = await parseJsonResponse<TerrainItemResponse | TerrainApiResponse>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not update terrain."));
  }

  const terrain = readTerrainItem(payload);

  if (!terrain) {
    throw new Error("Invalid update terrain response.");
  }

  return mapTerrain(terrain, 0);
}

export async function deleteOwnerTerrain(terrainId: string): Promise<void> {
  const response = await fetch(buildOwnerApiUrl(`/owner/terrains/${terrainId}`), {
    method: "DELETE",
    headers: buildAuthHeaders(),
  });

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not delete terrain."));
  }
}
