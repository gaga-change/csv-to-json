const csv = require('csv-parser')
const logger = require('koa-logger')
const os = require('os')
const fs = require('fs')
const Koa = require('koa')
const serve = require('koa-static')
const router = require('koa-router')()
const path = require('path')
const koaBody = require('koa-body')

const app = new Koa()
app.use(logger());

app.use(koaBody({
    multipart: true
}));
app.use(serve(path.join(__dirname, 'static')));

router.post('/api/turn', async ctx => {
    // const tmpdir = path.join(os.tmpdir(), '123456');
    // const files = ctx.request.body.files || {};
    const file = ctx.request.files.file;
    ctx.body = await new Promise((resolve, reject) => {
        let results = []
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

app.listen(3000, function () {
    console.log('listening on port 3000')
})