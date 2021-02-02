const tape = require('tape');
const ExtendedRouter = require('../index');
const Event = require('../lib/event');

tape('Extended Router', (t) => {
  const event = Event(); 
  const rootRouter = ExtendedRouter(event);
  const usersRouter = ExtendedRouter(event);
  const commentsRouter = ExtendedRouter(event);

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
