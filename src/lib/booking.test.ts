import { expect, test } from 'vitest';
import { serviceDates, serviceTimes, validateBookingStep, type BookingValues } from './booking';

const now = new Date('2026-11-02T12:00:00Z');
const valid: BookingValues = { date: '2026-11-03', guests: 2, time: '17:30', name: 'Guest', phone: '+27 82 123 4567' };
test('service dates exclude Mondays and stay within thirty Johannesburg days', () => {
  const dates = serviceDates(now);
  expect(dates[0]?.value).toBe('2026-11-03');
  expect(dates.at(-1)?.value).toBe('2026-12-02');
  expect(dates).toHaveLength(26);
  expect(dates.some(d => new Date(`${d.value}T12:00:00+02:00`).getUTCDay() === 1)).toBe(false);
});
test('service dates use Johannesburg rather than UTC at midnight and year-end', () => {
  expect(serviceDates(new Date('2026-11-02T21:59:00Z'))[0]?.value).toBe('2026-11-03');
  expect(serviceDates(new Date('2026-11-02T22:01:00Z'))[0]?.value).toBe('2026-11-04');
  expect(serviceDates(new Date('2026-12-31T20:00:00Z'))[0]?.value).toBe('2027-01-01');
  expect(serviceDates(new Date('invalid'))).toEqual([]);
});
test('booking stages enforce date, guest, time and contact requirements cumulatively', () => {
  expect(validateBookingStep(0, { ...valid, date: '' }, now)).toBeTruthy();
  for (const date of ['2026-11-02', '2026-11-09', '2027-01-01']) expect(validateBookingStep(3, { ...valid, date }, now)).toBeTruthy();
  for (const guests of [0, 9, 1.5, NaN]) expect(validateBookingStep(1, { ...valid, guests }, now)).toBeTruthy();
  expect(validateBookingStep(2, { ...valid, time: '03:00' }, now)).toBeTruthy();
  expect(validateBookingStep(3, { ...valid, name: ' ' }, now)).toBeTruthy();
  expect(validateBookingStep(3, { ...valid, phone: 'abc' }, now)).toBeTruthy();
  expect(validateBookingStep(3, valid, now)).toBeNull();
  expect(serviceTimes).toEqual(['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00']);
});
