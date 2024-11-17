const fs = require('fs');
const path = require('path');

let timestamp = null
async function getData(ctx, next) {
    // 检查时间戳
    if (!timestamp) {
        ctx.response.body = {
            code: '99999',
            data: {},
            msg: "计算未发生"
        }
        return
    }
    // 正常需要考虑并发请求的问题，这里暂时不做
    try {
        let data = await checkData()
        ctx.response.body = {
            code: '0',
            data: data
        }
    } catch (err) {
        console.error(err);
    }
    return
}


async function setConfig(ctx, next) {
    try {
        let params = {
            "action": "save",
            "value": ctx.request.body,
            "timestamp": new Date().getTime()
        }
        fs.writeFileSync(path.resolve(__dirname, '../temp/instructions.json'), JSON.stringify(params));
        ctx.response.body = {
            code: '0',
            data: {},
        }
    } catch (err) {
        console.error(err)
        ctx.response.body = {
            code: '99999',
            data: {}
        }
    }
    return
}

async function runProgram(ctx, next) {
    try {
        timestamp = new Date().getTime()
        let params = {
            "action": "run",
            "value": ctx.request.body,
            "timestamp": timestamp
        }
        fs.writeFileSync(path.resolve(__dirname, '../temp/instructions.json'), JSON.stringify(params));
        ctx.response.body = {
            code: '0',
            data: {},
        }
    } catch (err) {
        console.error(err)
        ctx.response.body = {
            code: '99999',
            data: {}
        }
    }
    return
}

async function checkSelf(ctx, next) {
    try {
        timestamp = new Date().getTime()
        let params = {
            "action": "check",
            "timestamp": new Date().getTime()
        }
        fs.writeFileSync(path.resolve(__dirname, '../temp/instructions.json'), JSON.stringify(params));
        let data  = await checkData('./temp/checkself_data.json', 10)
        ctx.response.body = {
            code: '0',
            data: data,
        }
    } catch (err) {
        console.error(err)
        ctx.response.body = {
            code: '99999',
            data: {}
        }
    }
    return
}


function checkData(_fileurl, _maxtime) {
    let fileurl = _fileurl || './temp/calculate_data.json'
    let maxtime = _maxtime || 7
    function loopFun() {
        const st = fs.readFileSync(fileurl, 'utf8');
        const data = JSON.parse(st)
        if (data.timestamp || (data.timestamp > timestamp)) {
            return data
        }
        return false
    }
    let timer = 0
    let count = 0
    return new Promise((resolve, reject) => {
        let data = loopFun()
        if (data) {
            resolve(data)
            return
        }
        timer = setInterval(() => {
            let data = loopFun()
            if (data) {
                clearInterval(timer)
                resolve(data)
                return
            }
            if (count > maxtime) {
                reject('超时')
            }
            count++
        }, 500)

    })
}

module.exports = {
    getData,
    setConfig,
    runProgram,
    checkSelf
}