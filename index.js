const express = require('express');
const path = require('path');

function methodEventObject(method, context, ...args) {
  const result = { method };

  if (typeof args[0] === 'string') {
    result.path = args[0];
    result.fullPath = path.join(context.fullPath(), args[0]);
  }
  return result;
}

module.exports = function ExtendedRouter(event) {

  const obj = {
    router: express.Router(),
    path: '/', 
    parent: null,
    use(...args) {

      const result = { };

      if (typeof args[0] === 'string') {
        this.path = args[0];
        result.path = args[0];

        // if args[1] has router
        // it must be a wrapper
        // pass on router to use function

        if (args[1].router) {
        
          args[1].parent = this;

          args[1] = args[1].router;

          result.fullPath = this.fullPath(); 
          result.type = 'router';
        } else {
          result.type = 'middleware';
        }
      }

      event.fire('use', result);

      this.router.use(...args); 
      return this; 
    },
    fullPath() {

      if (this.parent) {

        const parentPath = this.parent.fullPath();
        const thisPath = this.path;
        const joinedPath = path.join(parentPath, thisPath);

        return joinedPath;
      }
      return this.path;
    },
    get(...args) {
      event.fire('req', methodEventObject('get', this, ...args)); 
      this.router.get(...args); 
      return this; 
    }, 
    put(...args) {
      event.fire('req', methodEventObject('put', this, ...args)); 
      this.router.put(...args); 
      return this; 
    }, 
    post(...args) {
      event.fire('req', methodEventObject('post', this, ...args)); 
      this.router.post(...args); 
      return this; 
    }, 
    patch(...args) {
      event.fire('req', methodEventObject('patch', this, ...args)); 
      this.router.patch(...args); 
      return this; 
    }, 
    head(...args) {
      event.fire('req', methodEventObject('head', this, ...args)); 
      this.router.head(...args); 
      return this; 
    },   
    delete(...args) {
      event.fire('req', methodEventObject('delete', this, ...args)); 
      this.router.delete(...args); 
      return this; 
    }, 
    options(...args) {
      event.fire('req', methodEventObject('options', this, ...args)); 
      this.router.options(...args); 
      return this; 
    }, 
    trace(...args) {
      event.fire('req', methodEventObject('trace', this, ...args)); 
      this.router.trace(...args); 
      return this; 
    },
    expose() {
      console.log('this.fullPath', this.fullPath);
    }
  };


  return obj;

};
