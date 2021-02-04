const express = require('express')
const app = express()
const port = 3000

const ExpressRouterDoc = require('./index'); 
const event = require('./lib/event')(); 
const rootRouter = ExpressRouterDoc(event);
const usersRouter = ExpressRouterDoc(event);
const adminUsersRouter = ExpressRouterDoc(event);
const adminLoginRouter = ExpressRouterDoc(event);
const commentsRouter = ExpressRouterDoc(event);
const adminRouter = ExpressRouterDoc(event);
const apiDocsRouter = ExpressRouterDoc(event);
const docBuilder = require('./lib/doc-builder')();
const DocItem = require('./lib/doc-item');

/* a named middleware function */
/* this function name should appear in router docs */

function myMiddleware(req, res, next) {
  next();
}

/* handle routes events */
/* here: populate the doc builder */

event.on('use', (obj) => {
  docBuilder.addLine( obj );  
}); 

event.on('req', (obj) => {
  docBuilder.addLine( obj );  
}); 

/* build routes */

rootRouter
  .use('/admin', adminRouter); 

adminRouter
  .use('/', function ensureAuth(req, res, next) { next() });

adminRouter
  .use('/login', adminLoginRouter);

adminLoginRouter
  .get('/', (req, res) => { res.status(200).send('a login page') });

adminRouter
  .use('/users', adminUsersRouter);

rootRouter
  .use('/users', usersRouter, DocItem(d => d.title('the mounted users router instance')));

usersRouter
  .use('/:userId/comments', commentsRouter);

commentsRouter
  .put('/:id', (req, res) => { res.send('commentsRouter get id'); })
  .get('/', (req, res) => { res.send('commentsRouter get'); }) 

usersRouter.use('/:id', myMiddleware)
  .get('/:id', (req, res) => res.send('usersRouter get id'),
    DocItem(d => d
      .t('A single unser')
      .p(':id', 'number', 'Not a chicken')))
  .post('/', (req, res) => res.send('usersRouter root post'))
  .get('/', (req, res) => res.send('usersRouter root get paginated collection'),
    DocItem(d => d 
      .q('sort', 'collection', 'Cascading order', { order: [{by: 'fieldName', direction: 'DESC'}]})
      .q('scope', 'object', 'Scoping Filter', {active: '[true|false]'})));

rootRouter
  .use('/docs', apiDocsRouter)

apiDocsRouter
  .get('/', (req, res) => { res.status(200).send( docBuilder.buildHtml() ) });

rootRouter
  .get('/', (req, res) => { res.send('rootRouter get'); },
    DocItem(d => d.t(''))); 




app.use('/', rootRouter.router);

/* build routes */

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
