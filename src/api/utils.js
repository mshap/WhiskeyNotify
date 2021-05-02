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

const compareData = async (code, bucket) => {
    const obj = {
        now: 0,
        prior: 0
    }
    
    const keys = await cloud.list(bucket, code)

    if (keys.length > 0) {
        const now = await cloud.get(bucket, keys[0])
        obj.now = now.totalQuantity
        
        if (keys.length ==2) {
            const prior = await cloud.get(bucket, keys[1])
            obj.prior = prior.totalQuantity
        }
    }
    
    return obj;
}

const isChanged = data => {
    return data.now > 0 && data.prior === 0
}

const getProductCodes = async (bucket, user) => {
    let products = await cloud.get(bucket, 'products.json')

    const codes = products
        .filter(product => product.notify.indexOf(user.name) > -1)
        .map(product => product.code)
       
    const res = await Promise.all(codes.map(product => compareData(product, bucket)))
    const changed = codes.filter((code, i) => isChanged(res[i]));

    console.log(`Found ${changed.length} updated products`)

    return changed
}

module.exports = {
    build: buildMessage,
    getUserCodes: getProductCodes,
    isChanged: isChanged,
    compareData: compareData
}