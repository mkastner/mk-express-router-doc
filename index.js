const express = require('express');
const path = require('path');

function pathToRoot(context) {

  let parent = context;
  const pathItems = []; 

  while (parent) {
    pathItems.push(parent.path);
    parent = parent.parent; 
  }
 
  pathItems.reverse();

  return path.join(...pathItems);
} 

function extractDocItem(contextArgs) {

  const lastArgsItem = contextArgs[contextArgs.length - 1];

  if (!lastArgsItem) return false;
  if (lastArgsItem.DocItem) {
    contextArgs.pop(); 
    return lastArgsItem;
  } 
  return false;
}

function methodEventObject(method, context, docItem, ...args) {


  const result = { method, docItem: {} };
  Object.assign(result.docItem, docItem); 

  if (typeof args[0] === 'string') {
    result.path = args[0];
    result.fullPath = path.join(pathToRoot(context), args[0]);
  }
  return result;
}


module.exports = function ExpressRouterDoc(event) {

  const obj = {
    router: express.Router(),
    path: '/', 
    parent: null,
    use(...args) {

      const result = { 
        docItem: {}
      };

      if (typeof args[0] === 'string') {
        result.path = args[0];

        // if args[1] has router
        // it must be a wrapper
        // pass on router to use function

        if (args[1].router) {
        
          args[1].parent = this;
          args[1].path = args[0];


          result.fullPath = pathToRoot(args[1]);
          result.type = 'router';
          
          // make router second argument
          // instead of ExpressRouterDoc
          args[1] = args[1].router;
        } else {
          result.type = 'middleware';
          result.fullPath = path.join(pathToRoot(this), args[0]);
          result.name = args[1].name; 
        }
      }
     
      const docItem = extractDocItem(args);
      if (docItem) {
        Object.assign(result.docItem, docItem);
      } 
      event.fire('use', result);
      this.router.use(...args); 
      return this; 
    },
    get(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('get', this, docItem, ...args)); 
      this.router.get(...args); 
      return this; 
    }, 
    put(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('put', this, docItem, ...args)); 
      this.router.put(...args); 
      return this; 
    }, 
    post(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('post', this, docItem, ...args)); 
      this.router.post(...args); 
      return this; 
    }, 
    patch(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('patch', this, docItem, ...args)); 
      this.router.patch(...args); 
      return this; 
    }, 
    head(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('head', this, docItem, ...args)); 
      this.router.head(...args); 
      return this; 
    },   
    delete(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('delete', this, docItem, ...args)); 
      this.router.delete(...args); 
      return this; 
    }, 
    options(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('options', this, docItem, ...args)); 
      this.router.options(...args); 
      return this; 
    }, 
    trace(...args) {
      const docItem = extractDocItem(args);
      event.fire('req', methodEventObject('trace', this, docItem, ...args)); 
      this.router.trace(...args); 
      return this; 
    },
    expose() {
      console.log('this.fullPath', this.fullPath);
    }
  };


  return obj;

};
