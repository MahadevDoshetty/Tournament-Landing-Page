export const CATEGORIES = ["solo", "duo", "squad"] as const;

export type Category = (typeof CATEGORIES)[number];

export const FEES_INR: Record<Category, number> = {
  solo: 100,
  duo: 200,
  squad: 400,
};

export const EXTRA_MEMBERS_REQUIRED: Record<Category, number> = {
  solo: 0,
  duo: 1,
  squad: 3,
};

export function isCategory(value: string): value is Category {
  return CATEGORIES.includes(value as Category);
}

export function feeInPaise(category: Category): number {
  return FEES_INR[category] * 100;
}
