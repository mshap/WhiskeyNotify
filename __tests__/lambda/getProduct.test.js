const lambda = require('../../src/lambda/getProduct')
const abc = require('../../src/api/vaabc')

const products = require('../data/products.json')

jest.mock('../../src/api/vaabc', () => {
    return {
        getProduct: jest.fn(),
        inventory: jest.fn()
    }
})


describe('Load User File', () => {
    afterEach(() => {
        abc.getProduct.mockReset()
        abc.inventory.mockReset()
    })

    it('load empty file', async() => {
        const name = "Drank"
        const product = {
            "name": name,
            "code": "111111",
            "notify": ["Mark"]
        }

        const inv = {foo:"bar"}

        abc.getProduct.mockResolvedValueOnce(products[product.code])
        abc.inventory.mockReturnValueOnce(inv)

        // console.log( abc.inventory())
        expect(jest.isMockFunction(abc.getProduct)).toBeTruthy()
        expect(jest.isMockFunction(abc.inventory)).toBeTruthy()
        const res = await lambda.handler({productCode: product.code})

        expect(res.product).toEqual(inv)

        expect(abc.getProduct).toBeCalledWith(product.code)
        expect(abc.inventory).toBeCalledWith(products[product.code].products[0])
    })

    
})