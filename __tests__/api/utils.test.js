const utils = require('../../src/api/utils')

const cloud = require('../../src/api/aws')

jest.mock('../../src/api/aws', () => {
	return {
		send: jest.fn(),
		getProduct: jest.fn(),
		list: jest.fn(),
		get: jest.fn()
	}
})

test('Has New Data', () => {
	expect(
		utils.isChanged({
			now: 4,
			prior: 0
		})
	).toBeTruthy()
})

test('Has No data', () => {
	expect(
		utils.isChanged({
			now: 0,
			prior: 0
		})
	).toBeFalsy()
})

test('Not new data', () => {
	expect(
		utils.isChanged({
			now: 4,
			prior: 2
		})
	).toBeFalsy()
})

describe('Who knows', () => {
	beforeEach(() => {
		cloud.list.mockReset()
		cloud.get.mockReset()
	})

	it('Nothing Returned', async () => {
		expect(jest.isMockFunction(cloud.list)).toBeTruthy()
		expect(jest.isMockFunction(cloud.get)).toBeTruthy()
		cloud.list.mockResolvedValueOnce([])

		const res = await utils.compareData()

		expect(res).toEqual({ now: 0, prior: 0 })
	})

	it('One Object', async () => {
		cloud.list.mockResolvedValueOnce(['1'])
		cloud.get.mockResolvedValueOnce({ totalQuantity: 3 })

		const res = await utils.compareData('123', 'Bucket')

		expect(res).toEqual({ now: 3, prior: 0 })
		expect(cloud.get).toBeCalledWith('Bucket', '1')
		expect(cloud.get).toBeCalledTimes(1)
	})

	it('Two Objects', async () => {
		cloud.list.mockResolvedValueOnce(['1', '2'])
		cloud.get.mockResolvedValueOnce({ totalQuantity: 3 })
		cloud.get.mockResolvedValueOnce({ totalQuantity: 2 })

		const res = await utils.compareData('123', 'Bucket')

		expect(res).toEqual({ now: 3, prior: 2 })
		expect(cloud.get).toBeCalledWith('Bucket', '1')
		expect(cloud.get).toBeCalledWith('Bucket', '2')
		expect(cloud.get).toBeCalledTimes(2)
	})

	it('More Than Two Objects', async () => {
		cloud.list.mockResolvedValueOnce(['1', '2', '3'])
		cloud.get.mockResolvedValueOnce({ totalQuantity: 3 })
		cloud.get.mockResolvedValueOnce({ totalQuantity: 2 })
		cloud.get.mockResolvedValueOnce({ totalQuantity: 5 })

		const res = await utils.compareData('123', 'Bucket')

		expect(res).toEqual({ now: 3, prior: 2 })
		expect(cloud.get).toBeCalledWith('Bucket', '1')
		expect(cloud.get).toBeCalledWith('Bucket', '2')
		expect(cloud.get).toBeCalledTimes(2)
	})
})
