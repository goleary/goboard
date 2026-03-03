export interface AvailabilitySlot {
  time: string;
  slotsAvailable: number | null;
}

export interface AppointmentTypeAvailability {
  appointmentTypeId: string;
  name: string;
  price?: number;
  durationMinutes: number;
  private?: boolean;
  seats?: number;
  dates: Record<string, AvailabilitySlot[]>;
}

export interface AvailabilityResponse {
  appointmentTypes: AppointmentTypeAvailability[];
}
