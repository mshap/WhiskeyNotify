
const utils = require('../../src/api/utils')
const AWS = require('aws-sdk')

jest.mock('aws-sdk', () => {
    const S3Mocked = {
        listObjects: jest.fn().mockReturnThis(),
        getObject: jest.fn().mockReturnThis(),
        promise: jest.fn()
    }

    return {
        S3: jest.fn(() => S3Mocked)
    }
})

const s3 = new AWS.S3();

test('Has New Data', () => {
    expect(utils.isChanged({
        now: 4,
        prior: 0
    })).toBeTruthy()
})

test('Has No data', () => {
    expect(utils.isChanged({
        now: 0,
        prior: 0
    })).toBeFalsy()
})

test('Not new data', () => {
    expect(utils.isChanged({
        now: 4,
        prior: 2
    })).toBeFalsy()
})

describe('Who knows', () => {
    beforeEach(() => {
        (s3.listObjects().promise).mockReset()
        s3.getObject().promise.mockReset()
    })

    it('Nothing Returned', async () => {
        expect(jest.isMockFunction(s3.listObjects)).toBeTruthy()
        expect(jest.isMockFunction(s3.listObjects().promise)).toBeTruthy()
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: []
        })

        const res = await utils.compareData()

        expect(res).toEqual({now:0, prior:0})
    })

    it('One Object', async () => {
        expect(jest.isMockFunction(s3.getObject)).toBeTruthy()
        expect(jest.isMockFunction(s3.getObject().promise)).toBeTruthy()
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: [{LastModified: "April 17, 2021, 06:30:20"}]
        })
        s3.getObject().promise.mockResolvedValueOnce({Body: Buffer.from(JSON.stringify({totalQuantity:3}), "utf-8")})

        const res = await utils.compareData()

        expect(res).toEqual({now:3, prior:0})
    })

    it('Two Objects', async () => {
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: [
                {LastModified: "April 17, 2021, 06:30:20"},
                {LastModified: "April 18, 2021, 06:30:20"}
            ]
        })
        s3.getObject().promise.mockResolvedValueOnce({Body: Buffer.from(JSON.stringify({totalQuantity:3}), "utf-8")})
        s3.getObject().promise.mockResolvedValueOnce({Body: Buffer.from(JSON.stringify({totalQuantity:2}), "utf-8")})

        const res = await utils.compareData()

        expect(res).toEqual({now:3, prior:2})
    })

    it('More Than Two Objects', async () => {
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: [
                {LastModified: "April 17, 2021, 06:30:20"},
                {LastModified: "April 18, 2021, 06:30:20"},
                {LastModified: "April 19, 2021, 06:30:20"},
            ]
        })
        s3.getObject().promise.mockResolvedValueOnce({Body: Buffer.from(JSON.stringify({totalQuantity:3}), "utf-8")})
        s3.getObject().promise.mockResolvedValueOnce({Body: Buffer.from(JSON.stringify({totalQuantity:2}), "utf-8")})
        s3.getObject().promise.mockResolvedValueOnce({Body: Buffer.from(JSON.stringify({totalQuantity:5}), "utf-8")})

        const res = await utils.compareData()

        expect(res).toEqual({now:3, prior:2})
    })
})
