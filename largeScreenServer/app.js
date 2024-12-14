const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const router = require('./controller/router.map')
const static = require('koa-static');
const path = require('path');
const { historyApiFallback } = require('koa2-connect-history-api-fallback');
// const router = require('koa-router')();

const app = new Koa();

const env = process.argv.splice(2)[0];
console.log(`在环境${env}中启动`);

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });
// log request URL:

// 配置静态资源目录
const staticPath = path.join(__dirname, 'public');
app.use(historyApiFallback())
app.use(static(staticPath))

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

app.use(bodyParser());
// add router middleware:
app.use(router.routes);
app.use(router.allowedMethods);
const port = 3000
app.listen(port);
console.log(`app started at port ${port}...`);

// app.listen(3000);

