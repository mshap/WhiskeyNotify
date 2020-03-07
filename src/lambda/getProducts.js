const utils = require('../api/aws')

exports.handler = async (event) => {
    let products = await utils.get(event.bucket, 'products.json')

    products.push('SENTINEL')
    return products;
};