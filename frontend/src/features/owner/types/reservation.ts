export type ReservationStatus =
  | "confirmed"
  | "pending_payment"
  | "expired"
  | "payment_failed"
  | string;

export type OwnerReservationApiResponse = {
  id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  amount: number | null;
  terrain: {
    id: number;
    name: string;
    city: string;
  } | null;
  player: {
    id: number;
    name: string;
    email: string;
  } | null;
};

export type OwnerReservation = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  amount: number;
  terrain: {
    id: string;
    name: string;
    city: string;
  } | null;
  player: {
    id: string;
    name: string;
    email: string;
  } | null;
};
