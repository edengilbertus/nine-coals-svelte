import { expect, test } from 'vitest';
import { cartTotal, parseCart, updateCart } from './cart';

test('basket arithmetic uses the actual reference prices', () => {
  expect(cartTotal([{ dishId: 'tomahawk', quantity: 2 }])).toBe(1780);
  expect(cartTotal([{ dishId: 'tomahawk', quantity: 1 }, { dishId: 'fire-bread', quantity: 2 }])).toBe(1000);
});
test('storage accepts known dishes and combines duplicate lines safely', () => {
  expect(parseCart('[{"dishId":"tomahawk","quantity":2}]')).toEqual([{ dishId: 'tomahawk', quantity: 2 }]);
  expect(parseCart('[{"dishId":"tomahawk","quantity":80},{"dishId":"tomahawk","quantity":80}]')).toEqual([{ dishId: 'tomahawk', quantity: 99 }]);
});
test.each([null, 'invalid json', '{}', 'null', '[{"dishId":"unknown","quantity":1}]', '[{"dishId":"tomahawk","quantity":-1}]', '[{"dishId":"tomahawk","quantity":1.5}]', '[{"dishId":"tomahawk","quantity":"2"}]'])('malformed storage is rejected: %s', raw => {
  expect(parseCart(raw)).toEqual([]);
});
test('quantity changes reject invalid input, cap large values and remove zero', () => {
  const start = [{ dishId: 'tomahawk', quantity: 2 }];
  expect(updateCart(start, 'tomahawk', 200)).toEqual([{ dishId: 'tomahawk', quantity: 99 }]);
  for (const quantity of [-1, 1.5, NaN, Infinity]) expect(updateCart(start, 'tomahawk', quantity)).toEqual(start);
  expect(updateCart(start, 'unknown', 3)).toEqual(start);
  expect(updateCart(start, 'tomahawk', 0)).toEqual([]);
});

test('changing a quantity does not move the dish to the bottom of the basket', () => {
  expect(updateCart([{ dishId: 'tomahawk', quantity: 1 }, { dishId: 'fire-bread', quantity: 1 }], 'tomahawk', 2)).toEqual([{ dishId: 'tomahawk', quantity: 2 }, { dishId: 'fire-bread', quantity: 1 }]);
});
