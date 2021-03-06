const csv = require('csv-parser')
const logger = require('koa-logger')
const fs = require('fs')
const Koa = require('koa')
const serve = require('koa-static')
const router = require('koa-router')()
const path = require('path')
const koaBody = require('koa-body')
const { PORT } = require('./config')
const app = new Koa()
app.use(logger());

app.use(koaBody({
    multipart: true
}));
app.use(serve(path.join(__dirname, 'static')));

router.post('/api/turn', async ctx => {
    const file = ctx.request.files.file;
    ctx.body = await new Promise((resolve, reject) => {
        let results = []
        console.log('临时文件：', file.path, ' size:', (file.size / 1024 / 1024).toFixed(2) + 'M')
        fs.createReadStream(file.path)
            .pipe(csv({
                mapHeaders: ({
                    header,
                    index
                }) => {
                    return header.trim().toLowerCase()
                }
            }))
            .on('data', item => {
                results.push(item)
            })
            .on('end', () => {
                resolve(results)
            });
    })
})

function uid() {
    return Math.random().toString(36).slice(2);
}

app.use(router.routes())

app.listen(PORT, function () {
    console.log(`listening http://localhost:${PORT}`)
})