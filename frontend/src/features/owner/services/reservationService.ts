import {
  buildAuthHeaders,
  buildOwnerApiUrl,
  buildQueryString,
  parseJsonResponse,
  readApiError,
} from "@/features/owner/services/api";
import type {
  OwnerReservation,
  OwnerReservationApiResponse,
  ReservationStatus,
} from "@/features/owner/types/reservation";
import type { OwnerCalendarDay, OwnerCalendarDayApiResponse } from "@/features/owner/types/dashboard";

type ReservationCollectionResponse = {
  data?: OwnerReservationApiResponse[];
};

type ReservationItemResponse = {
  data?: OwnerReservationApiResponse;
};

type ReservationCalendarResponse = {
  month: string;
  calendar_days: OwnerCalendarDayApiResponse[];
};

export type ReservationFilters = {
  terrainId?: string;
  status?: ReservationStatus | "all";
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
};

function mapReservation(apiReservation: OwnerReservationApiResponse): OwnerReservation {
  return {
    id: String(apiReservation.id),
    date: apiReservation.date,
    startTime: apiReservation.start_time,
    endTime: apiReservation.end_time,
    status: apiReservation.status,
    amount: Number(apiReservation.amount ?? 0),
    terrain: apiReservation.terrain
      ? {
          id: String(apiReservation.terrain.id),
          name: apiReservation.terrain.name,
          city: apiReservation.terrain.city,
        }
      : null,
    player: apiReservation.player
      ? {
          id: String(apiReservation.player.id),
          name: apiReservation.player.name,
          email: apiReservation.player.email,
        }
      : null,
  };
}

function mapCalendarDay(apiDay: OwnerCalendarDayApiResponse): OwnerCalendarDay {
  return {
    date: apiDay.date,
    reservationCount: apiDay.reservation_count,
    confirmedCount: apiDay.confirmed_count,
    pendingCount: apiDay.pending_count,
    failedCount: apiDay.failed_count,
  };
}

function normalizeFilters(filters: ReservationFilters) {
  return {
    terrain_id: filters.terrainId,
    status: filters.status && filters.status !== "all" ? filters.status : undefined,
    date: filters.date,
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
    limit: filters.limit,
  };
}

function readReservationCollection(
  payload: ReservationCollectionResponse | OwnerReservationApiResponse[] | null
) {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload?.data ?? [];
}

function readReservationItem(
  payload: ReservationItemResponse | OwnerReservationApiResponse | null
) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if ("data" in payload && payload.data) {
    return payload.data;
  }

  return payload as OwnerReservationApiResponse;
}

export async function getOwnerReservations(
  filters: ReservationFilters = {}
): Promise<OwnerReservation[]> {
  const queryString = buildQueryString(normalizeFilters(filters));
  const response = await fetch(
    buildOwnerApiUrl(`/owner/reservations${queryString}`),
    {
      headers: buildAuthHeaders(),
    }
  );

  const payload = await parseJsonResponse<
    ReservationCollectionResponse | OwnerReservationApiResponse[]
  >(response);

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not load reservations."));
  }

  return readReservationCollection(payload).map(mapReservation);
}

export async function getOwnerReservationById(
  reservationId: string
): Promise<OwnerReservation> {
  const response = await fetch(
    buildOwnerApiUrl(`/owner/reservations/${reservationId}`),
    {
      headers: buildAuthHeaders(),
    }
  );

  const payload = await parseJsonResponse<ReservationItemResponse | OwnerReservationApiResponse>(
    response
  );

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not load reservation details."));
  }

  const reservation = readReservationItem(payload);

  if (!reservation) {
    throw new Error("Invalid reservation details response.");
  }

  return mapReservation(reservation);
}

export async function getReservationCalendar(
  month: string
): Promise<{ month: string; calendarDays: OwnerCalendarDay[] }> {
  const response = await fetch(
    buildOwnerApiUrl(`/owner/reservations/calendar${buildQueryString({ month })}`),
    {
      headers: buildAuthHeaders(),
    }
  );

  const payload = await parseJsonResponse<ReservationCalendarResponse>(response);

  if (!response.ok || !payload) {
    throw new Error(readApiError(payload, "Could not load reservation calendar."));
  }

  return {
    month: payload.month,
    calendarDays: payload.calendar_days.map(mapCalendarDay),
  };
}

export async function getTerrainReservations(
  terrainId: string,
  filters: ReservationFilters = {}
): Promise<OwnerReservation[]> {
  const queryString = buildQueryString(normalizeFilters(filters));
  const response = await fetch(
    buildOwnerApiUrl(`/owner/terrains/${terrainId}/reservations${queryString}`),
    {
      headers: buildAuthHeaders(),
    }
  );

  const payload = await parseJsonResponse<
    ReservationCollectionResponse | OwnerReservationApiResponse[]
  >(response);

  if (!response.ok) {
    throw new Error(readApiError(payload, "Could not load terrain reservations."));
  }

  return readReservationCollection(payload).map(mapReservation);
}
