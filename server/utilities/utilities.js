module.exports = {
  format12HourTime: rawTime => {
    if (!rawTime) return '';
    const [hour, minute] = rawTime.split(':');
    const parsedHour = parseInt(hour, 10);
    const period = parsedHour >= 12 ? 'PM' : 'AM';
    const formattedHour = parsedHour % 12 || 12;
    return `${formattedHour}:${minute} ${period}`;
  },

  extractInfo: (message,keyword, indexOfVal, plusIndex, minusIndex, returnVal) => {
    if (message.indexOf(keyword) === -1) {
      return returnVal;
    } else {
      const startIndex = message.indexOf(keyword) + keyword.length + plusIndex;
      const endIndex = message.indexOf(indexOfVal, startIndex);
      return message.substring(startIndex, endIndex - minusIndex);
    }
  },
};
