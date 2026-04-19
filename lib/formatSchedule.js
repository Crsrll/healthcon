// lib/formatSchedule.js

export function formatSchedule(availability) {
  // 1. Safety check: If availability or days are missing, don't crash
  if (!availability || !availability.days || availability.days.length === 0) {
    return "Schedule not set";
  }

  const { days, startTime, endTime } = availability;

  function formatTime(time24) {
    if (!time24) return "??:??";
    try {
      const [hour, minute] = time24.split(':').map(Number);
      const date = new Date();
      date.setHours(hour, minute);

      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      return time24; // Fallback to raw string if split fails
    }
  }

  // 2. Format: "Mon, Wed, Fri | 8:00 AM - 12:00 PM"
  // Using .substring(0,3) makes the list shorter for UI cards
  const shortDays = days.map(d => d.substring(0, 3)).join(', ');
  
  return `${shortDays} | ${formatTime(startTime)} - ${formatTime(endTime)}`;
}