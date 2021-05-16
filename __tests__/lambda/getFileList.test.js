const lambda = require('../../src/lambda/getProducts')
const cloud = require('../../src/api/aws')

jest.mock('../../src/api/aws', () => {
    return {
        get: jest.fn()
    }
})

describe('Load Products File', () => {
    afterEach(() => {
        cloud.get.mockReset()
    })

    it('load empty file', async() => {
        cloud.get.mockResolvedValueOnce([])
        expect(jest.isMockFunction(cloud.get)).toBeTruthy()
        const res = await lambda.handler({bucket: 'Test'})

        expect(res).toEqual({
            bucket: 'Test',
            workList: ['SENTINEL'],
            next: 'SENTINEL'
        })
    })

    it('load valid file file', async() => {
        cloud.get.mockResolvedValueOnce(['123'])
        expect(jest.isMockFunction(cloud.get)).toBeTruthy()
        const res = await lambda.handler({bucket: 'Test'})

        expect(res).toEqual({
            bucket: 'Test',
            workList: ['123','SENTINEL'],
            next: '123'
        })
    })
})