export type ServiceDate = { value: string; label: string };
export type BookingValues = { date: string; guests: number; time: string; name: string; phone: string };
export function serviceDates(now: Date): ServiceDate[] {
  if (!Number.isFinite(now.getTime())) return [];
  const day = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Johannesburg', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  const start = new Date(`${day}T12:00:00+02:00`);
  const dates: ServiceDate[] = [];
  for (let offset = 1; offset <= 30; offset++) {
    const date = new Date(start.getTime() + offset * 86400000);
    if (date.getUTCDay() === 1) continue;
    dates.push({ value: date.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Johannesburg', weekday: 'short', day: '2-digit', month: 'short' }).format(date) });
  }
  return dates;
}
export const serviceTimes = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
export const validPhone = (phone: string): boolean => /^[+\d\s()\-]+$/.test(phone) && phone.replace(/\D/g, '').length >= 7 && phone.replace(/\D/g, '').length <= 15;
export function validateBookingStep(step: number, values: BookingValues, now: Date): string | null {
  if (!serviceDates(now).some(date => date.value === values.date)) return 'Choose an available day in the next 30 days.';
  if (step >= 1 && (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > 8)) return 'Choose between 1 and 8 guests.';
  if (step >= 2 && !serviceTimes.includes(values.time)) return 'Choose a service time.';
  if (step >= 3 && (!values.name.trim() || values.name.trim().length > 120)) return 'Please enter your name.';
  if (step >= 3 && !validPhone(values.phone)) return 'Please enter a valid mobile number.';
  return null;
}
