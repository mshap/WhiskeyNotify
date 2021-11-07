const gateway = require('../../src/api/gateway')
const cloud = require('../../src/api/aws')

const users = require('../data/users.json')
const products = require('../data/stock.json')

jest.mock('../../src/api/aws', () => {
	return {
		get: jest.fn()
	}
})

describe('Show Users', () => {
	beforeEach(() => {
		cloud.get.mockReset()
	})

	it('Anyone', async () => {
		expect(jest.isMockFunction(cloud.get)).toBeTruthy()
		cloud.get.mockResolvedValueOnce(users['single'])

		const res = await gateway.users('')

		expect(res).not.toBeNull()
		expect(res.length).toEqual(1)
		expect(res[0]).toBe('John Doe')
	})

	it('Full List', async () => {
		expect(jest.isMockFunction(cloud.get)).toBeTruthy()
		cloud.get.mockResolvedValueOnce(users['multiple'])

		const res = await gateway.users('myBucket')

		expect(cloud.get).toBeCalledWith('myBucket', 'users.json')
		expect(res).not.toBeNull()
		expect(res.length).toEqual(3)
		expect(res[2]).toBe('Diane')
	})
})

describe('Notifications', () => {
	beforeEach(() => {
		cloud.get.mockReset()
	})

	it('No one', async () => {
		expect(jest.isMockFunction(cloud.get)).toBeTruthy()
		cloud.get.mockResolvedValueOnce(products)

		const res = await gateway.products('badname')
		console.log(res)
		expect(res).not.toBeNull()
		expect(res.length).toEqual(0)
	})

	it('Single', async () => {
		expect(jest.isMockFunction(cloud.get)).toBeTruthy()
		cloud.get.mockResolvedValueOnce(products)

		const res = await gateway.products('Donald')
		expect(res).not.toBeNull()
		expect(res.length).toEqual(1)
		expect(res[0]).toBe('Buffalo Trace')
	})

	it('Multiple', async () => {
		expect(jest.isMockFunction(cloud.get)).toBeTruthy()
		cloud.get.mockResolvedValueOnce(products)

		const res = await gateway.products('John')
		expect(res).not.toBeNull()
		expect(res.length).toEqual(19)
		expect(res[18]).toBe('High West A Midwinter Nights Dram')
	})
})
