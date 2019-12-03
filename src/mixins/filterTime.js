export default {
  filters: {
    formatTime(time) {
      if(time) {
        return time.slice(0, 10);
      }
    }
  }
}