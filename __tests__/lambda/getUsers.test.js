const lambda = require('../../src/lambda/getUsers')
const cloud = require('../../src/api/aws')

jest.mock('../../src/api/aws', () => {
    return {
        get: jest.fn()
    }
})

describe('Load User File', () => {
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
        cloud.get.mockResolvedValueOnce(['User'])
        expect(jest.isMockFunction(cloud.get)).toBeTruthy()
        const res = await lambda.handler({bucket: 'Test'})

        expect(res).toEqual({
            bucket: 'Test',
            workList: ['User','SENTINEL'],
            next: 'User'
        })
    })
})