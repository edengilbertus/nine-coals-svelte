import { dishes } from './data/menu';
export type CartLine = { dishId: string; quantity: number };
export const CART_STORAGE_KEY = 'nine-coals-basket';
const prices = new Map(dishes.map(d => [d.id, d.price]));
export function parseCart(raw: string | null): CartLine[] {
  try {
    const data: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(data)) return [];
    const lines = new Map<string, number>();
    for (const item of data) {
      if (!item || typeof item !== 'object' || !prices.has(item.dishId) || !Number.isInteger(item.quantity) || item.quantity <= 0) continue;
      lines.set(item.dishId, Math.min(99, (lines.get(item.dishId) ?? 0) + item.quantity));
    }
    return [...lines].map(([dishId, quantity]) => ({ dishId, quantity }));
  } catch { return []; }
}
export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + (prices.get(line.dishId) ?? 0) * line.quantity, 0);
}
export function updateCart(lines: CartLine[], dishId: string, quantity: number): CartLine[] {
  if (!prices.has(dishId) || !Number.isInteger(quantity) || quantity < 0) return lines;
  if (quantity === 0) return lines.filter(line => line.dishId !== dishId);
  const next = { dishId, quantity: Math.min(99, quantity) };
  return lines.some(line => line.dishId === dishId) ? lines.map(line => line.dishId === dishId ? next : line) : [...lines, next];
}
