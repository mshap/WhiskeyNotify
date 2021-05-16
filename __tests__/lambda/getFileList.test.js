const lambda = require('../../src/lambda/getFileList')
const cloud = require('../../src/api/aws')

jest.mock('../../src/api/aws', () => {
    return {
        get: jest.fn()
    }
})

const mocks = {
    'empty': [],
    'load': ['123']
}

describe('Load Products File', () => {
    afterEach(() => {
        cloud.get.mockReset()
    })

    it('load empty file', async() => {
        const input = 'empty'
        cloud.get.mockResolvedValueOnce(mocks[input])
        expect(jest.isMockFunction(cloud.get)).toBeTruthy()
        const res = await lambda.handler({bucket: 'Test', inputFile: input})

        expect(res).toEqual({
            bucket: 'Test',
            inputFile: input,
            workList: ['SENTINEL'],
            next: 'SENTINEL'
        })
        expect(cloud.get).toBeCalledWith("Test", input)
    })

    it('load valid file file', async() => {
        const input = 'load'
        cloud.get.mockResolvedValueOnce(mocks[input])
        expect(jest.isMockFunction(cloud.get)).toBeTruthy()
        const res = await lambda.handler({bucket: 'Test', inputFile: input})

        expect(res).toEqual({
            bucket: 'Test',
            inputFile: input,
            workList: ['123','SENTINEL'],
            next: '123'
        })
        expect(cloud.get).toBeCalledWith("Test", input)
    })
})