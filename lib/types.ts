export type ShiftCode = 'P' | 'S' | 'L' | 'OFF' | '';

export interface Sales {
  id: string;
  brand: string;
  name: string;
  senin: ShiftCode;
  selasa: ShiftCode;
  rabu: ShiftCode;
  kamis: ShiftCode;
  jumat: ShiftCode;
  sabtu: ShiftCode;
  minggu: ShiftCode;
  toilet: string;
  toilet2: string;
}

export type DayKey = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';

export type HarianData = Record<DayKey, Record<string, Record<string, string[]>>>;

export interface AppData {
  sales: Sales[];
  colors: Record<string, string>;
  harian: HarianData;
  adminEmails: string[];
  promotorEmails: string[]; // Tambahan untuk daftar promotor
  updatedAt?: string;
}