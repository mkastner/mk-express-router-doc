const tape = require('tape');
const ExpressRouterDoc = require('../index');
const Event = require('../lib/event');
const DocBuilder = require('../lib/doc-builder');

tape('Express Router Doc', (t) => {
  const event = Event(); 
  const rootRouter = ExpressRouterDoc(event);
  const usersRouter = ExpressRouterDoc(event);
  const commentsRouter = ExpressRouterDoc(event);

  t.test('event', (t) => {

    event.on('use', (obj) => {
      console.log('on use', obj);
    }); 

    event.on('req', (obj) => {
      console.log('on method', obj);
    }); 
    
    rootRouter.get('/', () => { console.log('rootRouter get'); }); 
    rootRouter.use('/users', usersRouter);
    rootRouter.get('/:id', () => { console.log('rootRouter get'); }); 

    usersRouter.use('/comments', commentsRouter); 

    commentsRouter.get('/', () => { console.log('commentsRouter get'); }); 
    commentsRouter.get('/:id', () => { console.log('commentsRouter get'); }); 
    t.end();

  });

  t.end(); 
});
