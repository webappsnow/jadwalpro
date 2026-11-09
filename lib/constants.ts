import type { HarianData, Sales } from './types';

export const SHIFT_ORDER = ['P', 'S', 'L', 'OFF'] as const;

export const HARI_LABELS = {
  senin: 'SENIN', selasa: 'SELASA', rabu: 'RABU',
  kamis: 'KAMIS', jumat: "JUM'AT", sabtu: 'SABTU', minggu: 'MINGGU',
} as const;

export const HARI_ORDER = ['senin','selasa','rabu','kamis','jumat','sabtu','minggu'] as const;

// DATA SHIFT KOSONG (Mulai dari nol)
export const DEFAULT_SALES: Omit<Sales, 'id'>[] = [];

// DATA PIKET HARIAN KOSONG (Area tetap ada, tugas kosong)
export const DEFAULT_HARIAN: HarianData = {
  senin: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
  selasa: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
  rabu: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
  kamis: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
  jumat: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
  sabtu: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
  minggu: {
    'LANTAI 1': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'LANTAI 2/AV': { 'MENYAPU': [], 'MENGEPEL': [], 'CLEAN BRAND NON PROMOTOR + TANGGA': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
    'FREEZER': { 'MENYAPU': [], 'MENGEPEL': [], 'GENERAL CLEANING (SETELAH PIKET)': [] },
  },
};

export const TUGAS_OPTIONS = [
  'MENYAPU', 
  'MENGEPEL', 
  'CLEAN BRAND NON PROMOTOR + TANGGA', 
  'GENERAL CLEANING (SETELAH PIKET)'
] as const;