module.exports = function Event() {
  return Object.create({
    on(name, handler) {
      if (!this.handlers[name]) {
        this.handlers[name] = [handler];
        return handler;
      }
    },
    fire(name, obj) {
      const handlers = this.handlers[name];
      if (!handlers) return false; 

      for (let i = 0, l = handlers.length; i < l; i++) {
        handlers[i](obj); 
      } 
    }
  },
  { 
    handlers: {
      type: Object,
      value: {}
    }
  });
}
