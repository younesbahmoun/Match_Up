import {
  buildAuthHeaders,
  buildOwnerApiUrl,
  parseJsonResponse,
  readApiError,
} from "@/features/owner/services/api";
import type {
  AvailabilityApiResponse,
  AvailabilityInput,
  AvailabilitySlot,
} from "@/features/owner/types/availability";

type AvailabilityCollectionResponse = {
  data?: AvailabilityApiResponse[];
};

type AvailabilityItemResponse = {
  data?: AvailabilityApiResponse;
};

function mapAvailability(apiAvailability: AvailabilityApiResponse): AvailabilitySlot {
  return {
    id: String(apiAvailability.id),
    terrainId: String(apiAvailability.terrain_id),
    dayOfWeek: apiAvailability.day_of_week,
    dayLabel: apiAvailability.day_label,
    startTime: apiAvailability.start_time,
    endTime: apiAvailability.end_time,
  };
}

function normalizeTime(value: string): string {
  return value.length === 5 ? `${value}:00` : value;
}

function readCollection(
  payload: AvailabilityCollectionResponse | AvailabilityApiResponse[] | null
) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data ?? [];
}

function readItem(payload: AvailabilityItemResponse | AvailabilityApiResponse | null) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  return payload as AvailabilityApiResponse;
}

export async function getTerrainAvailabilities(
  terrainId: string
): Promise<AvailabilitySlot[]> {
  const response = await fetch(
    buildOwnerApiUrl(`/owner/terrains/${terrainId}/availabilities`),
    { headers: buildAuthHeaders() }
  );

  const payload = await parseJsonResponse<
    AvailabilityCollectionResponse | AvailabilityApiResponse[]
  >(response);

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not load availability slots."));
  }

  return readCollection(payload).map(mapAvailability);
}

export async function createAvailability(
  terrainId: string,
  input: AvailabilityInput
): Promise<AvailabilitySlot> {
  const response = await fetch(
    buildOwnerApiUrl(`/owner/terrains/${terrainId}/availabilities`),
    {
      method: "POST",
      headers: buildAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        day_of_week: input.day_of_week,
        start_time: normalizeTime(input.start_time),
        end_time: normalizeTime(input.end_time),
      }),
    }
  );

  const payload = await parseJsonResponse<AvailabilityItemResponse | AvailabilityApiResponse>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not create availability."));
  }

  const availability = readItem(payload);

  if (!availability) {
    throw new Error("Invalid availability response.");
  }

  return mapAvailability(availability);
}

export async function updateAvailability(
  terrainId: string,
  availabilityId: string,
  input: AvailabilityInput
): Promise<AvailabilitySlot> {
  const response = await fetch(
    buildOwnerApiUrl(`/owner/terrains/${terrainId}/availabilities/${availabilityId}`),
    {
      method: "PATCH",
      headers: buildAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        start_time: normalizeTime(input.start_time),
        end_time: normalizeTime(input.end_time),
      }),
    }
  );

  const payload = await parseJsonResponse<AvailabilityItemResponse | AvailabilityApiResponse>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not update availability."));
  }

  const availability = readItem(payload);

  if (!availability) {
    throw new Error("Invalid availability response.");
  }

  return mapAvailability(availability);
}

export async function deleteAvailability(
  terrainId: string,
  availabilityId: string
): Promise<void> {
  const response = await fetch(
    buildOwnerApiUrl(`/owner/terrains/${terrainId}/availabilities/${availabilityId}`),
    {
      method: "DELETE",
      headers: buildAuthHeaders(),
    }
  );

  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not delete availability."));
  }
}
