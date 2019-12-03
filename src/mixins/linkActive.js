export default {
  directives: {
    active(el, bindings, vNode) {
      el.ontouchstart = function() {
        this.classList.add("active");
      };
      el.ontouchend = function() {
        this.classList.remove("active");
      };
    }
  }
}