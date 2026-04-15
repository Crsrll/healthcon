export function formatSchedule(availability) {
  if (!availability) return "No schedule";

  const { days, startTime, endTime } = availability;

  function formatTime(time24) {
    const [hour, minute] = time24.split(':').map(Number);
    const date = new Date();
    date.setHours(hour, minute);

    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  return `${days.join(', ')} | ${formatTime(startTime)} - ${formatTime(endTime)}`;
}