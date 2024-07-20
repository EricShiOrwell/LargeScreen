const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const multer = require('@koa/multer');

async function getCsv(ctx, next) {
    let response = []
    try {
        response = await readCsv(path.resolve(__dirname, `../temp/${ctx.request.body.name}.csv`))
        //     "value": ctx.request.body,
    } catch (err) {
        console.error(err)
        ctx.response.body = {
            code: '99999',
            data: {},
            msg: "文件异常，可能是因为导入了错误的文件，请重新导入"
        }
    }
    ctx.response.body = {
        code: '0',
        data: response,
    }
    return
}

function readCsv(_path) {
    const response = []
    return new Promise((resolve, reject) => {
        fs.createReadStream(_path)
            .pipe(csv.parse())
            .on('error', error => { console.error(error); reject(error) })
            .on('data', row => {
                response.push(row)
            }
            )
            .on('end', rowCount => resolve(response));
    })
}
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, `../temp`),
    filename: function (req, file, cb) {
        cb(null, req.body.name + '.csv')
        // cb(null, 'table3.csv')
    }
})
const saveCsvUploader = multer({ storage: storage })

async function saveCsv(ctx, next) {
    ctx.response.body = {
        code: '0',
        data: {},
    }
    return
}

async function downloaderCsv(ctx, next) {
    const name = ctx.query.name
    const filepath = path.resolve(__dirname, `../temp`, name + '.csv')
    const Size = fs.statSync(filepath).size;
    const createReadStream = fs.createReadStream(filepath)
    ctx.set('Content-disposition', 'attachment; filename=' + name + '.csv')
    ctx.set('Content-type', 'text/csv')
    ctx.set('Content-Length', Size)
    ctx.body = createReadStream
}
async function saveCsvData(ctx, next) {
    let data = ctx.request.body.data
    ctx.response.body = {
        code: '0',
        data: {},
    }
    // 接口不对外，暂时不检查参数
    // Array.isArray(data)
    try {
        const stream = fs.createWriteStream(path.resolve(__dirname, '..', 'temp', ctx.request.body.name + '.csv'));
        const csvWriteStream = csv.format();
        csvWriteStream.pipe(stream);
        // 写入数据
        data.forEach(element => {
            csvWriteStream.write(element);
        });
        // 结束写入
        csvWriteStream.end();
    } catch (error) {
        ctx.response.body = {
            code: '999',
            data: {},
            msg: '写入异常'
        }
    }
}

module.exports = {
    getCsv,
    saveCsvUploader,
    saveCsv,
    downloaderCsv,
    saveCsvData
}