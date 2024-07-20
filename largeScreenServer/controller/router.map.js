const Router = require('@koa/router');
const router = new Router({
  prefix: '/api'
});

const userController = require('./userController.js')
const taskController = require('./taskController.js')
const csvController = require('./csvController.js')

router.post('/login', userController.login);
router.post('/getData', taskController.getData);
router.post('/setConfig', taskController.setConfig);
router.post('/run', taskController.runProgram);
router.post('/getCsv', csvController.getCsv);
router.get('/download/csv', csvController.downloaderCsv);
router.post('/saveCsv', csvController.saveCsvUploader.single('file'), csvController.saveCsv);
router.post('/saveCsvData', csvController.saveCsvData);

// add url-route:
// router.get('/hello/:name', async (ctx, next) => {
//     var name = ctx.params.name;
//     ctx.response.body = `<h1>Hello, ${name}!</h1>`;
//   });

// router.get('/', async (ctx, next) => {
//   ctx.response.body = '<h1>Index</h1>';
// });

// router.get('/123', async (ctx, next) => {
//     console.log(123)
//     ctx.response.body = '<h1>Index</h1>';
// });
// router.get('/123', async (ctx, next) => {
//     console.log(123)
//     ctx.response.body = '<h1>Index</h1>';
// });
module.exports = {
  routes: router.routes(),
  allowedMethods: router.allowedMethods()
}