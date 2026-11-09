import type { HarianData, Sales } from './types';

export const SHIFT_ORDER = ['P', 'S', 'L', 'OFF'] as const;

export const HARI_LABELS = {
  senin: 'SENIN', selasa: 'SELASA', rabu: 'RABU',
  kamis: 'KAMIS', jumat: "JUM'AT", sabtu: 'SABTU', minggu: 'MINGGU',
} as const;

export const HARI_ORDER = ['senin','selasa','rabu','kamis','jumat','sabtu','minggu'] as const;

export const DEFAULT_SALES: Omit<Sales, 'id'>[] = [
  { brand: 'SHARP', name: 'AYUNG', senin: 'P', selasa: 'OFF', rabu: 'S', kamis: 'L', jumat: 'P', sabtu: 'S', minggu: 'P', toilet: '', toilet2: '' },
  { brand: 'SAMSUNG', name: 'FEBRI', senin: 'S', selasa: 'L', rabu: 'P', kamis: 'OFF', jumat: 'S', sabtu: 'P', minggu: 'S', toilet: '', toilet2: '' },
];

export const DEFAULT_HARIAN: HarianData = {
  senin: {
    'LANTAI 1': { 'MENYAPU': ['MIDEA','GREE','LG'], 'MENGEPEL': ['SHARP','POLYTRON'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['SANKEN','AQUA'] },
    'LANTAI 2/AV': { 'MENYAPU': ['TOSHIBA'], 'MENGEPEL': ['CHANGHONG'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['TCL'] },
    'FREEZER': { 'MENYAPU': ['MODENA'], 'MENGEPEL': ['ARTUGO'] },
  },
  selasa: {
    'LANTAI 1': { 'MENYAPU': ['MIDEA','SANKEN'], 'MENGEPEL': ['AQUA','GREE','LG'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['SAMSUNG','POLYTRON'] },
    'LANTAI 2/AV': { 'MENYAPU': ['CHANGHONG'], 'MENGEPEL': ['TCL'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['TOSHIBA'] },
    'FREEZER': { 'MENYAPU': ['ARTUGO'], 'MENGEPEL': ['MODENA'] },
  },
  rabu: {
    'LANTAI 1': { 'MENYAPU': ['ELECTROLUX','PANASONIC'], 'MENGEPEL': ['SAMSUNG','MIDEA','LG'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['SANKEN'] },
    'LANTAI 2/AV': { 'MENYAPU': ['TOSHIBA'], 'MENGEPEL': ['TCL'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['CHANGHONG'] },
    'FREEZER': { 'MENYAPU': ['AQUA'], 'MENGEPEL': ['ARTUGO'] },
  },
  kamis: {
    'LANTAI 1': { 'MENYAPU': ['MIDEA','SHARP','LG'], 'MENGEPEL': ['PANASONIC','AQUA'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['ADVANCE'] },
    'LANTAI 2/AV': { 'MENYAPU': ['CHANGHONG'], 'MENGEPEL': ['TOSHIBA'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['TCL'] },
    'FREEZER': { 'MENYAPU': ['ARTUGO'], 'MENGEPEL': ['MODENA'] },
  },
  jumat: {
    'LANTAI 1': { 'MENYAPU': ['ELECTROLUX','MIDEA'], 'MENGEPEL': ['GREE','SHARP'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['POLYTRON'] },
    'LANTAI 2/AV': { 'MENYAPU': ['CHANGHONG'], 'MENGEPEL': ['TCL'], 'CLEAN BRAND NON PROMOTOR + TANGGA': ['TOSHIBA'] },
    'FREEZER': { 'MENYAPU': ['AQUA'], 'MENGEPEL': ['ARTUGO'] },
  },
  // SABTU: Piket Harian + General Cleaning
  sabtu: {
    'LANTAI 1': { 
      'MENYAPU': ['MIDEA','GREE'], 
      'MENGEPEL': ['SHARP','POLYTRON'], 
      'CLEAN BRAND NON PROMOTOR + TANGGA': ['SANKEN'],
      'GENERAL CLEANING (SETELAH PIKET)': [] 
    },
    'LANTAI 2/AV': { 
      'MENYAPU': ['TOSHIBA'], 
      'MENGEPEL': ['CHANGHONG'], 
      'CLEAN BRAND NON PROMOTOR + TANGGA': ['TCL'],
      'GENERAL CLEANING (SETELAH PIKET)': [] 
    },
    'FREEZER': { 
      'MENYAPU': ['MODENA'], 
      'MENGEPEL': ['ARTUGO'],
      'GENERAL CLEANING (SETELAH PIKET)': [] 
    },
  },
  // MINGGU: Piket Harian + General Cleaning
  minggu: {
    'LANTAI 1': { 
      'MENYAPU': ['MIDEA','LG'], 
      'MENGEPEL': ['AQUA','GREE'], 
      'CLEAN BRAND NON PROMOTOR + TANGGA': ['POLYTRON'],
      'GENERAL CLEANING (SETELAH PIKET)': [] 
    },
    'LANTAI 2/AV': { 
      'MENYAPU': ['CHANGHONG'], 
      'MENGEPEL': ['TOSHIBA'], 
      'CLEAN BRAND NON PROMOTOR + TANGGA': ['TCL'],
      'GENERAL CLEANING (SETELAH PIKET)': [] 
    },
    'FREEZER': { 
      'MENYAPU': ['ARTUGO'], 
      'MENGEPEL': ['MODENA'],
      'GENERAL CLEANING (SETELAH PIKET)': [] 
    },
  },
};

export const TUGAS_OPTIONS = [
  'MENYAPU', 
  'MENGEPEL', 
  'CLEAN BRAND NON PROMOTOR + TANGGA', 
  'GENERAL CLEANING (SETELAH PIKET)'
] as const;