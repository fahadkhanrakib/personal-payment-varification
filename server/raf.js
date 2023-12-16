function extractInfo(keyword, indexOfVal, plusIndex, minusIndex, returnVal) {
        if (message.indexOf(keyword) === -1) {
          return returnVal;
        } else {
          const startIndex = message.indexOf(keyword) + keyword.length + plusIndex;
          const endIndex = message.indexOf(indexOfVal, startIndex);
          return message.substring(startIndex, endIndex - minusIndex);
        }
      }

function extractInfo(keyword, indexOfVal, plusIndex, minusIndex, returnVal) {
  if (message.indexOf(keyword) === -1) {
    return returnVal;
  } else {
    const startIndex = message.indexOf(keyword) + keyword.length + plusIndex;
    const endIndex = message.indexOf(indexOfVal, startIndex);
    return message.substring(startIndex, endIndex - minusIndex);
  }
}
