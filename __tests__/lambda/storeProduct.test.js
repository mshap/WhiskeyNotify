const lambda = require('../../src/lambda/storeProduct')
const abc = require('../../src/api/vaabc')
const cloud = require('../../src/api/aws')

const products = require('../data/products.json')

jest.mock('../../src/api/vaabc', () => {
    return {
        getProduct: jest.fn(),
        inventory: jest.fn()
    }
})

jest.mock('../../src/api/aws', () => {
    return {
        save: jest.fn()
    }
})

describe('Load User File', () => {
    afterEach(() => {
        abc.getProduct.mockReset()
        abc.inventory.mockReset()
        cloud.save.mockReset()
    })

    it('load empty file', async() => {
        const product = {
            "name": "Drank",
            "code": "111111",
            "notify": ["Mark"]
        }

        const inv = "MyInventory"

        abc.getProduct.mockResolvedValueOnce(products[product.code])
        abc.inventory.mockReturnValueOnce(inv)
        cloud.save.mockResolvedValueOnce()

        // console.log( abc.inventory())
        expect(jest.isMockFunction(abc.getProduct)).toBeTruthy()
        expect(jest.isMockFunction(abc.inventory)).toBeTruthy()
        expect(jest.isMockFunction(cloud.save)).toBeTruthy()
        const res = await lambda.handler({bucket: 'Test', workList: [product, "NEXT"]})

        expect(res).toEqual({
            bucket: 'Test',
            workList: ['NEXT'],
            next: 'NEXT'
        })

        expect(abc.getProduct).toBeCalledWith(product.code)
        expect(abc.inventory).toBeCalledWith(products[product.code].products[0], product.name)
        expect(cloud.save).toBeCalledWith("Test", product.code, inv)
    })

    
})