const got = require('got');
// const storeId = 331;

const getProductJson = async (productCode, storeId = 331) => {
    return await got(
            `https://www.abc.virginia.gov/webapi/inventory/storeNearby?storeNumber=${storeId}&productCode=${productCode}&mileRadius=20&storeCount=5&buffer=0`,
            {responseType: 'json', resolveBodyOnly: true})
}

const hasProduct = result => {
    return result.storeInfo.quantity > 0 || result.nearbyStores.length > 0
}

const buildStore = store => {
    return {
        description: store.shoppingCenter,
        name: `Store ID: ${store.storeId}`,
        address: store.address,
        phone: store.PhoneNumber.FormattedPhoneNumber,
        quantity: store.quantity
    }
}

const getInventory = (storeInfo) => {
    let inventory = {
        totalQuantity: 0,
        stores: [],
        productId: storeInfo.productId
    }

    if (hasProduct(storeInfo)) {
        inventory.totalQuantity = storeInfo.nearbyStores.reduce((prev, curr) => curr.quantity + prev, storeInfo.storeInfo.quantity)
        inventory.stores = storeInfo.nearbyStores
            .reduce((prev, curr) => {
                prev.push(curr)
                return prev
            }, [storeInfo.storeInfo])
                .filter(store => store.quantity > 0)
                .map(buildStore)
    }

    return inventory
}

module.exports = {
    getProduct: getProductJson,
    inventory: getInventory,
    hasProduct: hasProduct,
    buildStore: buildStore
}