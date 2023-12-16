module.exports = {
  format12HourTime: rawTime => {
    if (!rawTime) return '';
    const [hour, minute] = rawTime.split(':');
    const parsedHour = parseInt(hour, 10);
    const period = parsedHour >= 12 ? 'PM' : 'AM';
    const formattedHour = parsedHour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  },
};
