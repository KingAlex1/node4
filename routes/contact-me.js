const Router = require("koa-router");
const nodemailer = require("nodemailer");
const router = new Router();
const koaBody = require("koa-body");
const config = require("../config.json");
const db = require("../models/db");

const mailer = (name, email, message) => {
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
        from: config.mail.smtp.auth.user,
        to: `"${name}" <${email}>`,
        subject: config.mail.subject,
        text: message.trim().slice(0, 500) + `\n Отправлено с: <${email}>`
    };
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            }
            resolve();
        });
    });
};

router.get("/contact", async ctx => {
    ctx.body = ctx.render("pages/contact-me");
});
router.post("/contact", koaBody(), async ctx => {
    const { name, email, message } = ctx.request.body;
    if (!name || !email || !message) {
        return (ctx.body = { msg: "Все поля нужно заполнить!", status: "Error" });
    }
    const error = await mailer(name, email, message);
    if (error) {
        ctx.body = {
            mes: `При отправке письма произошла ошибка!: ${error}`,
            status: "Error"
        };
    }
    ctx.body = {
        mes: "Сообщение отправлено!",
        status: "OK"
    };
});

module.exports = router;
