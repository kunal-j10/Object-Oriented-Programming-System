import merge from "lodash/merge";

export const getFullDate = (date) => {
  if (!(date instanceof Date)) {
    return "DD/MM/YYYY";
  }

  let res;
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (day < 10) {
    res = "0" + day + "/";
  } else {
    res = day + "/";
  }

  if (month < 10) {
    res += "0" + month + "/";
  } else {
    res += month + "/";
  }

  res += year;

  return res;
};

export const getTimeFromMilliSec = (durationMillis) => {
  let second = 0,
    minute = 0,
    hour = 0;

  second = parseInt(durationMillis / 1000);
  if (second > 59) {
    minute = parseInt(second / 60);
    second = second - minute * 60;
  }
  if (minute > 59) {
    hour = parseInt(minute / 60);
    minute = minute - hour * 60;
  }
  return {
    second: String(second).padStart(2, "0"),
    minute: String(minute).padStart(2, "0"),
    hour: String(hour).padStart(2, "0"),
  };
};

export const deepMerge = (target, source) => {
  const result = { ...target, ...source };
  const keys = Object.keys(result);
  for (const key of keys) {
    const tprop = target[key];
    const sprop = source[key];
    if (typeof tprop === "object" && typeof sprop === "object") {
      result[key] = deepMerge(tprop, sprop);
    }
  }
  return result;
};

export const getCloser = (value, checkOne, checkTwo) =>
  Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

export const getWordCount = (sentence) => {
  const matches = sentence.match(/\S+/g);
  return matches ? matches.length : 0;
};

export const integerRange = (start, end) => {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
};

export const videoIdRegex = (url) => {
  return url.match(/.{11}$/)[0];
};

export const updateLikeState = (list, id, newData) => {
  const idx = list.findIndex((item) => item._id === id);

  if (idx > -1) {
    list[idx] = merge(list[idx], newData);
  }
};
