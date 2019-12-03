export default {
  methods: {
    getTime(val) {
      var year = val.getFullYear();
      var month = val.getMonth() + 1;
      var day = val.getDate();
      var hour = val.getHours();
      var min = val.getMinutes();
      var date = `${year}-${month >= 10 ? month : `0${month}`}-${
        day >= 10 ? day : `0${day}`
      } ${hour >= 10 ? hour : `0${hour}`}:${min >= 10 ? min : `0${min}`}`;
      return date;
    },
    formatDate(type, value) {
      switch (type) {
        case "year":
          return `${value}年`;
          break;
        case "month":
          return `${value}月`;
          break;
        case "day":
          return `${value}日`;
          break;
        case "hour":
          return `${value}时`;
          break;
        case "minute":
          return `${value}分`;
          break;
      }
    },
  }
}