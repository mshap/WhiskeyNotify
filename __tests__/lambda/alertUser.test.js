const lambda = require('../../src/lambda/alertUser')
const cloud = require('../../src/api/aws')
const utils = require('../../src/api/utils')

jest.mock('../../src/api/aws', () => {
    return {
        send: jest.fn()
    }
})

jest.mock('../../src/api/utils', () => {
    return {
        getUserCodes: jest.fn(),
        build: jest.fn()
    }
})

describe('', () => {
    afterEach(() => {
        cloud.send.mockReset()
        utils.getUserCodes.mockReset()
        utils.build.mockReset()
    })

    it('No Send', async () => {
        const user = {name:"JohnDoe", topic: "MyTopic"}
        const msg = ""
        const codes = []
        const bucket = "MyBucket"

        cloud.send.mockResolvedValueOnce()
        utils.getUserCodes.mockResolvedValueOnce(codes)
        utils.build.mockResolvedValueOnce(msg)

        const res = await lambda.handler({send: false, workList: [user, "next", "END"], bucket: bucket})

        expect(utils.build).toBeCalledWith(bucket, codes)
        expect(cloud.send).toBeCalledTimes(0)
        expect(res.next).toEqual("next")
        expect(res.workList.length).toEqual(2)

    })

    it('1 Code', async () => {
        const user = {name:"JohnDoe", topic: "MyTopic"}
        const msg = "Found 123"
        const codes = ["123"]
        const bucket = "MyBucket"

        cloud.send.mockResolvedValueOnce()
        utils.getUserCodes.mockResolvedValueOnce(codes)
        utils.build.mockResolvedValueOnce(msg)

        const res = await lambda.handler({send: true, workList: [user, "END"], bucket: bucket})

        expect(utils.build).toBeCalledWith(bucket, codes)
        expect(cloud.send).toBeCalledWith(user.topic, msg)
        expect(cloud.send).toBeCalledTimes(1)
        expect(res.next).toEqual("END")
        expect(res.workList).toEqual(["END"])
    })
})