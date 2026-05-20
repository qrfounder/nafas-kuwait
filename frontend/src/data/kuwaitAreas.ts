/** Kuwait governorates for delivery addressing. */

export const KUWAIT_GOVERNORATES = [
  'العاصمة',
  'حولي',
  'الفروانية',
  'مبارك الكبير',
  'الأحمدي',
  'الجهراء',
] as const

export type KuwaitGovernorate = (typeof KUWAIT_GOVERNORATES)[number]
