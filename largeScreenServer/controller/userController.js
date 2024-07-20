const userMap = require('../config/user.js')

async function login(ctx, next) {
    if(!ctx.request.body || !ctx.request.body.username ) {
        ctx.response.body = {
            code: '9999',
            data: {},
            errmsg: ''
        }
        return
    }
    let name = ctx.request.body.username
    if(userMap[name] === ctx.request.body.password) {
        ctx.response.body = {
            code: '0',
            data: {token: 'tempcode'},
        }
        return
    }
    ctx.response.body = {
        code: '9999',
        data: {},
        errmsg: ''
    };
}

module.exports = {
    login
}