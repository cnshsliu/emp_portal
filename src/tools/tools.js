const Tools = {
  NID: "000000000000000000000000",
  USER_SYS: "000000000000000000000000",
  USER_AST: "000000000000000000000001",
  MAX_PIN_KEEP: -365,
  toISOString: function (date) {
    return date.toISOString();
  },
  getISODate: function (date) {
    let y = date.getFullYear();
    let m = date.getMonth() + 1;
    let d = date.getDate();

    return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d);
  },
  ISODate: function (fodate) {
    return (
      fodate.year +
      "-" +
      (fodate.month < 10 ? "0" + fodate.month : fodate.month) +
      "-" +
      (fodate.day < 10 ? "0" + fodate.day : fodate.day)
    );
  },
  getBeforeDate: function (month) {
    let y = Number(month.substring(0, 4));
    let m = Number(month.substring(5)) + 1;
    if (m > 12) {
      m = 1;
      y = y + 1;
    }
    let d = 1;
    let tmp = y + "-";
    if (m < 10) tmp += "0";
    tmp += m;
    tmp += "-01";
    return new Date(tmp);
  },
  hasValue: function (obj) {
    if (obj === undefined) return false;
    if (obj === null) return false;
    if (obj === "") return false;

    return true;
  },
  isEmpty: function (obj) {
    return !this.hasValue(obj);
  },
  sleep: async function (miliseconds) {
    await new Promise((resolve) => setTimeout(resolve, miliseconds));
  },

  copyObject: function (obj) {
    let ret = {};
    for (let key in obj) {
      if (key !== "_id") ret[key] = obj[key];
    }
    return ret;
  },
  copyObjectAsis: function (obj) {
    let ret = {};
    for (let key in obj) {
      ret[key] = obj[key];
    }
    return ret;
  },

  fromObject: function (obj, names) {
    let ret = {};
    for (let i = 0; i < names.length; i++) {
      if (obj[names[i]] !== undefined) ret[names[i]] = obj[names[i]];
    }
    return ret;
  },

  log: function (obj, tag) {
    if (tag) console.log(tag + " " + JSON.stringify(obj));
    else console.log(JSON.stringify(obj));
  },
};
module.exports = Tools;
