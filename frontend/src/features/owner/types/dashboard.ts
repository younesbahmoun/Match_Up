import type {
  OwnerReservation,
  OwnerReservationApiResponse,
} from "@/features/owner/types/reservation";

export type OwnerCalendarDayApiResponse = {
  date: string;
  reservation_count: number;
  confirmed_count: number;
  pending_count: number;
  failed_count: number;
};

export type OwnerDashboardApiResponse = {
  month: string;
  stats: {
    total_terrains: number;
    active_slots: number;
    reservations_this_month: number;
    revenue_this_month: number;
  };
  recent_reservations: OwnerReservationApiResponse[];
  calendar_days: OwnerCalendarDayApiResponse[];
};

export type OwnerCalendarDay = {
  date: string;
  reservationCount: number;
  confirmedCount: number;
  pendingCount: number;
  failedCount: number;
};

export type OwnerDashboardData = {
  month: string;
  stats: {
    totalTerrains: number;
    activeSlots: number;
    reservationsThisMonth: number;
    revenueThisMonth: number;
  };
  recentReservations: OwnerReservation[];
  calendarDays: OwnerCalendarDay[];
};
