const Router = require("koa-router");

const router = new Router();

router.get("/", async ctx => {
    ctx.body = ctx.render("pages/index");
});

module.exports = router;
