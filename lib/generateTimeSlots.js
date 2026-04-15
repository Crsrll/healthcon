export function generateTimeSlots(start, end) {
  const slots = [];
  let [hour, minute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);

  while (
    hour < endHour ||
    (hour === endHour && minute < endMinute)
  ) {
    const date = new Date();
    date.setHours(hour, minute);

    slots.push(
      date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    );

    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
}