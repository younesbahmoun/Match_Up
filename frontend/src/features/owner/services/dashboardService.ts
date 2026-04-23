import {
  buildAuthHeaders,
  buildOwnerApiUrl,
  buildQueryString,
  parseJsonResponse,
  readApiError,
} from "@/features/owner/services/api";
import type {
  OwnerCalendarDay,
  OwnerCalendarDayApiResponse,
  OwnerDashboardApiResponse,
  OwnerDashboardData,
} from "@/features/owner/types/dashboard";
import type { OwnerReservation, OwnerReservationApiResponse } from "@/features/owner/types/reservation";

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

export async function getOwnerDashboard(
  month?: string
): Promise<OwnerDashboardData> {
  const queryString = buildQueryString({ month });
  const response = await fetch(buildOwnerApiUrl(`/owner/dashboard${queryString}`), {
    headers: buildAuthHeaders(),
  });

  const payload = await parseJsonResponse<OwnerDashboardApiResponse>(response);

  if (!response.ok || !payload) {
    throw new Error(readApiError(payload, "Could not load owner dashboard."));
  }

  return {
    month: payload.month,
    stats: {
      totalTerrains: payload.stats.total_terrains,
      activeSlots: payload.stats.active_slots,
      reservationsThisMonth: payload.stats.reservations_this_month,
      revenueThisMonth: payload.stats.revenue_this_month,
    },
    recentReservations: payload.recent_reservations.map(mapReservation),
    calendarDays: payload.calendar_days.map(mapCalendarDay),
  };
}
