jest.mock('got')

const abc = require('../src/api/vaabc')

test('call site API', async () => {
    const prodId = "666666"
    const json = await  abc.getProduct(prodId)
    
    expect(json.products[0].productId).toEqual(prodId)
})

test('Has No Product', async() => {
    const prodId = "666666"
    const json = await  abc.getProduct(prodId)

    expect(abc.hasProduct(json.products[0])).toEqual(false)
})

test('Has Product', async() => {
    const prodId = "019880"
    const json = await  abc.getProduct(prodId)

    expect(abc.hasProduct(json.products[0])).toEqual(true)
})


test('Create Object', async() => {
    const prodId = "111111"
    const json = await  abc.getProduct(prodId)

    const store = abc.buildStore(json.products[0].storeInfo)

    expect(store.description).toEqual("Test Center")
    expect(store.name).toEqual("Store ID: 111")
    expect(store.address).toEqual("123 Main St")
    expect(store.phone).toEqual("(555) 555-5555")
})

test('Empty store inventory', async() => {
    const prodId = "666666"
    const json = await  abc.getProduct(prodId)

    expect(json.products[0].nearbyStores.length).toEqual(0)

    const inventory = abc.inventory(json.products[0])

    expect(inventory.totalQuantity).toEqual(0)
})

test('Multiple Store inventory', async() => {
    const prodId = "019880"
    const json = await  abc.getProduct(prodId)

    expect(json.products[0].nearbyStores.length).toBeGreaterThan(0)

    const inventory = abc.inventory(json.products[0])

    expect(inventory.totalQuantity).toEqual(47)
    expect(inventory.stores.length).toEqual(json.products[0].nearbyStores.length + 1)
})

test('Single Store inventory', async() => {
    const prodId = "111111"
    const json = await  abc.getProduct(prodId)

    expect(json.products[0].nearbyStores.length).toEqual(0)

    const inventory = abc.inventory(json.products[0])

    expect(inventory.totalQuantity).toEqual(6)
    expect(inventory.stores.length).toEqual(1)
})