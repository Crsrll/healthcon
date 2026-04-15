// lib/timeUtils.js

export function timeToMinutes(timeStr) {
  if (!timeStr) return 0;

  // 24h format: "09:00", "17:30"
  if (!timeStr.includes('AM') && !timeStr.includes('PM')) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // 12h format: "9:00 AM", "1:30 PM"
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}