const cloud = require('../api/aws')

exports.handler = async (event) => {
    let products = await cloud.get(event.bucket, 'products.json')

    products.push('SENTINEL')
    
    event.workList = products
    event.next = products[0]
    
    return event
};