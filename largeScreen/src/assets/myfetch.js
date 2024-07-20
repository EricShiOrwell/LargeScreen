export function request(params) {
    return new Promise((resolve, reject) => {
        fetch(params.url, {
            method: params.method || 'POST', // 指定请求方法
            headers: {
                'Content-Type': 'application/json' // 设置请求的Content-Type
            },
            body: JSON.stringify(params.data || {}) // 将数据转换为JSON字符串
        }).then(response => {
            if (response.ok) {
                return response.json(); // 如果响应成功，解析JSON
            }
            throw new Error('Network response was not ok.');
        }).then(data => {
            if (data.code === '0') {
                resolve(data.data)
            } else {
                reject(data)
            }
        }) // 处理解析的数据
            .catch(error => reject(error)); // 捕获错误
    })
}