import { expect, test } from 'vitest';
import { beds, dishes, signatures, formatPrice } from './menu';

test('the reference menu groups seventeen distinct dishes under nine valid beds', () => {
  expect(beds).toHaveLength(9);
  expect(dishes).toHaveLength(17);
  expect(signatures).toHaveLength(11);
  expect(new Set(dishes.map(d => d.id)).size).toBe(17);
  for (const dish of dishes) {
    expect(beds.some(b => b.id === dish.bedId)).toBe(true);
    expect(Number.isInteger(dish.price) && dish.price > 0).toBe(true);
  }
  expect(dishes.find(d => d.id === 'tomahawk')?.price).toBe(890);
  expect(formatPrice(890)).toBe('R 890');
});
