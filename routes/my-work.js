const Router = require("koa-router");
const path = require("path");
const fs = require("fs");
const router = new Router();
const koaBody = require("koa-body");
const db = require("../models/db");

const verifyForm = (projectName, projectUrl, text) => {
    let response;
    if (projectName === "") {
        response = {
            mes: "Не загружена название проекта",
            status: "Error"
        };
    }
    if (projectUrl === "") {
        response = {
            mes: "Не загружена url адрес проекта",
            status: "Error"
        };
    }
    if (text === "") {
        response = {
            mes: "Не загруженo описание проекта",
            status: "Error"
        };
    }
    return response;
};

const rename = (path, fileName) => {
    return new Promise((resolve, reject) => {
        fs.rename(path, fileName, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

router.get("/work", async ctx => {
    const works = db.getState().works || [];
    ctx.body = ctx.render("pages/my-work", {
        isAuthorized: ctx.session.isAuthorized,
        works
    });
});
router.post(
    "/work",
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: process.cwd() + "/public/upload"
        }
    }),
    async ctx => {
        let upload = process.cwd() + "/public/upload";
        let fileName;
        const { projectName, projectUrl, text } = ctx.request.body.fields;
        const { name, size, path } = ctx.request.body.files.file;
        let responseError = verifyForm(projectName, projectUrl, text);
        if (responseError) {
            ctx.body = responseError;
        }
        if (name === "" || size === 0) {
            return (ctx.body = {
                mes: "Не загружена картинка проекта",
                status: "Error"
            });
        }
        fileName = upload + "/" + name;
        const error = await rename(path, fileName);
        if (error) {
            ctx.body = {
                mes: "При загрузке проекта произошла ошибка",
                status: "Error"
            };
        }
        let dir = fileName.substr(fileName.indexOf("upload/"));
        db
            .get("works")
            .push({ projectName, projectUrl, text, dir })
            .write();
        ctx.body = {
            mes: "Проект успешно загружен",
            status: "OK"
        };
    }
);

module.exports = router;
