export type AvailabilityApiResponse = {
  id: number;
  terrain_id: number;
  day_of_week: number;
  day_label: string;
  start_time: string;
  end_time: string;
};

export type AvailabilitySlot = {
  id: string;
  terrainId: string;
  dayOfWeek: number;
  dayLabel: string;
  startTime: string;
  endTime: string;
};

export type AvailabilityInput = {
  day_of_week: number;
  start_time: string;
  end_time: string;
};
