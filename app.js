const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const { key } = require("./config.json");
const Pug = require("koa-pug");
const Router = require("koa-router");
  const path = require("path");
const session = require("koa-session");

const index = require('./routes/index');
const login = require("./routes/login");
const contact = require("./routes/contact-me");
const work = require("./routes/my-work");

const CONFIG = {
  key: key, /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
};

app.keys = [key];
const router = new Router();
const pug = new Pug({
  viewPath: "./views",
  basedir: "./views",
  app: app
});
app.context.render = pug.render;

app.use(session(CONFIG, app));

app.use(index.routes());
app.use(work.routes());
app.use(contact.routes());
app.use(login.routes());

app.use(router.routes());

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))



// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})


// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


app.listen(8080);
console.log('listening on port 8080');
module.exports = app




