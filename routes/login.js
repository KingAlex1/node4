const Router = require("koa-router");

const router = new Router();

const koaBody = require("koa-body");
const db = require("../models/db");

router.get("/login", async ctx => {
    ctx.body = ctx.render("pages/login");
});
router.post("/login", koaBody(), async ctx => {
    const { login, password } = ctx.request.body;
    const user = db.getState().user;
    if (user.login === login && user.password === password) {
        ctx.session.isAuthorized = true;
        ctx.body = {
            mes: "Aвторизация успешна!",
            status: "OK"
        };
    } else {
        ctx.body = {
            mes: "Логин и/или пароль введены неверно!",
            status: "Error"
        };
    }
});

module.exports = router;
