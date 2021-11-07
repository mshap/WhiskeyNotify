const lambda = require('../../src/lambda/userApi')
const gateway = require('../../src/api/gateway')

jest.mock('../../src/api/gateway', () => {
	return {
		users: jest.fn(),
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
		gateway.users.mockReset()
		gateway.products.mockReset()

		process.env = OLD_ENV
	})

	it('set env var', async () => {
		expect(process.env.BUCKET_NAME).not.toBeTruthy()

		process.env.BUCKET_NAME = 'foo'

		expect(process.env.BUCKET_NAME).toBeTruthy()
	})

	it('get users', async () => {
		const users = ['Jack', 'Diane']
		const bucket = 'myBucket'
		process.env.BUCKET_NAME = bucket
		gateway.users.mockResolvedValueOnce(users)

		expect(jest.isMockFunction(gateway.users)).toBeTruthy()

		const res = await lambda.list()
		expect(gateway.users).toBeCalledWith(bucket)
		expect(res).toBeTruthy()
		expect(res.statusCode).toEqual(200)
		expect(res.body).toEqual(JSON.stringify(users))
	})

	it('get products for user', async () => {
		const products = ['Water', 'Coke']
		const bucket = 'anotherBucket'
		const user = 'Tyler'
		process.env.BUCKET_NAME = bucket
		gateway.products.mockResolvedValueOnce(products)

		expect(jest.isMockFunction(gateway.products)).toBeTruthy()

		const res = await lambda.products({ pathParameters: { user } })
		expect(gateway.products).toBeCalledWith(user, bucket)
		expect(res).toBeTruthy()
		expect(res.statusCode).toEqual(200)
		expect(res.body).toEqual(JSON.stringify(products))
	})
})
