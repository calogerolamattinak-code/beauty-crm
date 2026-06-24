export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  salonName: string;
  address?: string;
  photoURL?: string;
  createdAt: Date;
  isPremium: boolean;
  settings: UserSettings;
}

export interface UserSettings {
  workingHours: DaySchedule;
  breakDuration: number;
  reminderEnabled: boolean;
  reminderHoursBefore: number;
  whatsappNumber: string;
}

export interface DaySchedule {
  monday: TimeRange;
  tuesday: TimeRange;
  wednesday: TimeRange;
  thursday: TimeRange;
  friday: TimeRange;
  saturday: TimeRange;
  sunday: TimeRange;
}

export interface TimeRange {
  start: string; // "09:00"
  end: string;   // "19:00"
  isActive: boolean;
}

export interface Service {
  id: string;
  userId: string;
  name: string;
  duration: number; // minutes
  price: number;    // euros
  color: string;    // hex color
  isActive: boolean;
  order: number;
}

export interface Client {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  preferredServices: string[];
  lastVisit?: Date;
  totalVisits: number;
  createdAt: Date;
  birthDate?: string;
  reminderConsent: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  duration: number;
  price: number;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
}

export type SubscriptionTier = 'free' | 'premium';

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  clientLimit: number; // free = 30, premium = infinity
  features: string[];
  expiresAt?: Date;
}
