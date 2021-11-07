const lambda = require('../../src/lambda/productApi')
const gateway = require('../../src/api/gateway')

jest.mock('../../src/api/gateway', () => {
	return {
		products: jest.fn()
	}
})

describe('Load User File', () => {
	const OLD_ENV = process.env

	beforeEach(() => {
		jest.resetModules()
		process.env = { ...OLD_ENV }
	})

	afterEach(() => {
		gateway.products.mockReset()

		process.env = OLD_ENV
	})

	it('set env var', async () => {
		expect(process.env.BUCKET_NAME).not.toBeTruthy()

		process.env.BUCKET_NAME = 'foo'

		expect(process.env.BUCKET_NAME).toBeTruthy()
	})

	it('get products', async () => {
		const products = ['Milk', 'Lemonade']
		const bucket = 'myBucket'
		process.env.BUCKET_NAME = bucket
		gateway.products.mockResolvedValueOnce(products)

		expect(jest.isMockFunction(gateway.products)).toBeTruthy()

		const res = await lambda.list()
		expect(gateway.products).toBeCalledWith(bucket)
		expect(res).toBeTruthy()
		expect(res.statusCode).toEqual(200)
		expect(res.body).toEqual(JSON.stringify(products))
	})
})
