const cloud = require('./aws')

const parseInfo = (info) => {
    const msg = `There are ${info.totalQuantity} bottles of ${info.name} at the following locations:\n`
    
    return info.stores.reduce((buildMsg, store) => {
        return `${buildMsg}\n${store.name} (${store.description})
        ${store.address}
        Phone: ${store.phone}
        ------------\n`
    }, msg)
}

const buildMessage = async (bucket, codes) => {
    let inventory = []
    
    for (const code of codes) {
        inventory.push(await cloud.getProduct(bucket, code))
    }
    
    const message = inventory
        .filter(info => info.totalQuantity > 0)
        .reduce((msg, info) => {
        return `${msg}\n${parseInfo(info)}`
    }, "")
    
    return message;
}

const isChanged = async (code, bucket) => {
    const today = await cloud.getProduct(bucket, code)
    const yesterday = await cloud.getProduct(bucket, code, -1)

    return today.totalQuantity > 0 && yesterday.totalQuantity == 0;
}

const getProductCodes = async (bucket, user) => {
    let products = await cloud.get(bucket, 'products.json')

    const newCodes = products
        .filter(product => product.notify.indexOf(user.name) > -1)
        .filter(product => isChanged(product.code, bucket))
        .map(product => product.code)

    return newCodes;
}

module.exports = {
    build: buildMessage,
    getUserCodes: getProductCodes
}