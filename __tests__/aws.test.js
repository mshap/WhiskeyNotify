
const moment = require('moment-timezone')
const AWS = require('aws-sdk')

jest.mock('aws-sdk', () => {
    const S3Mocked = {
        listObjects: jest.fn().mockReturnThis(),
        getObject: jest.fn().mockReturnThis(),
        putObject: jest.fn().mockReturnThis(),
        promise: jest.fn()
    }

    const SNSMocked = {
        publish: jest.fn().mockReturnThis(),
        promise: jest.fn()
    }

    return {
        SNS: jest.fn(() => SNSMocked),
        S3: jest.fn(() => S3Mocked),
    }
})
const cloud = require('../src/api/aws')
const s3 = new AWS.S3()
const sns = new AWS.SNS()

describe('SNS Send testing', () => {
    afterEach(() => {
        (sns.publish().promise).mockReset()
    })

    it('Nothing Returned', async () => {
        expect(jest.isMockFunction(sns.publish)).toBeTruthy()
        expect(jest.isMockFunction(sns.publish().promise)).toBeTruthy()
        sns.publish().promise.mockResolvedValueOnce('Should not execute')

        expect(await cloud.send('FakeTopic', '')).not.toBeTruthy()
    })

    it('Send Success', async () => {
        const MessageId = "123456"

        sns.publish().promise.mockResolvedValueOnce({
            MessageId
        })
        const res = await cloud.send('FakeTopic', 'Something To Send')
        expect(res.MessageId).toEqual(MessageId)
    })
})

describe('List Latest Products', () => {
    afterEach(() => {
        (s3.listObjects().promise).mockReset()
    })

    it('Nothing Returned', async () => {
        expect(jest.isMockFunction(s3.listObjects)).toBeTruthy()
        expect(jest.isMockFunction(s3.listObjects().promise)).toBeTruthy()
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: []
        })

        const res = await cloud.list("BucketName", "MyKey")
        expect(res).toBeTruthy()
        expect(res.length).toEqual(0)
        expect(s3.listObjects).toBeCalledWith({Bucket: "BucketName", Prefix: "history/MyKey"})
        expect(s3.listObjects().promise).toBeCalledTimes(1)
    })

    it('One Object', async () => {
       s3.listObjects().promise.mockResolvedValueOnce({
            Contents: [{LastModified: "April 17, 2021, 06:30:20", Key: 99}]
        })
      
        const res = await cloud.list("1","2")

        expect(res).toBeTruthy()
        expect(res.length).toEqual(1)
        expect(res[0]).toEqual(99)
    })

    it('Two Objects', async () => {
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: [
                {LastModified: "April 17, 2021, 06:30:20", Key: 1},
                {LastModified: "April 18, 2021, 06:30:20", Key: 2}
            ]
        })
     
        const res = await cloud.list()
        
        expect(res).toBeTruthy()
        expect(res.length).toEqual(2)
        expect(res[0]).toEqual(2)
        expect(res[1]).toEqual(1)
    })

    it('More Than Two Objects', async () => {
        s3.listObjects().promise.mockResolvedValueOnce({
            Contents: [
                {LastModified: "April 17, 2021, 06:30:20", Key: 2},
                {LastModified: "April 18, 2021, 06:30:20", Key: 3},
                {LastModified: "April 19, 2021, 06:30:20", Key: 1},
            ]
        })
       
        const res = await cloud.list()

        expect(res).toBeTruthy()
        expect(res.length).toEqual(2)
        expect(res[0]).toEqual(1)
        expect(res[1]).toEqual(3)
    })
})

describe('Get a File', () => {
    afterEach(() => {
        (s3.getObject().promise).mockReset()
    })

    it('File has been gotten', async () => {
        expect(jest.isMockFunction(s3.getObject)).toBeTruthy()
        expect(jest.isMockFunction(s3.getObject().promise)).toBeTruthy()

        const val = {mocked:true}
        s3.getObject().promise.mockResolvedValueOnce({
            Body: Buffer.from(JSON.stringify(val, "utf-8"))
        })

        const res = await cloud.get("BucketName", "MyKey")
        expect(res).toBeTruthy()
        expect(res).toEqual(val)
        expect(s3.getObject).toBeCalledWith({Bucket: "BucketName", Key: "MyKey"})
        expect(s3.getObject().promise).toBeCalledTimes(1)
    })

    it('Get Current Date', async () => {
        const val = {today:true}
        s3.getObject().promise.mockResolvedValueOnce({
            Body: Buffer.from(JSON.stringify(val, "utf-8"))
        })

        const res = await cloud.getProduct("BucketName", "Code")
        expect(res).toBeTruthy()
        expect(res).toEqual(val)
        expect(s3.getObject).toBeCalledWith({Bucket: "BucketName", Key: `history/Code/${moment().tz('America/New_York').format('MM-DD-YYYY HH:MM')}.json`})
        expect(s3.getObject().promise).toBeCalledTimes(1)
    })

    it('Get Yesterday', async () => {
        const val = {today:false}
        s3.getObject().promise.mockResolvedValueOnce({
            Body: Buffer.from(JSON.stringify(val, "utf-8"))
        })

        const res = await cloud.getProduct("BucketName", "Code", -1)
        expect(res).toBeTruthy()
        expect(res).toEqual(val)
        expect(s3.getObject).toBeCalledWith({Bucket: "BucketName", Key: `history/Code/${moment().tz('America/New_York').add(-1, 'days').format('MM-DD-YYYY HH:MM')}.json`})
        expect(s3.getObject().promise).toBeCalledTimes(1)
    })
})

describe('Save a File', () => {
    afterEach(() => {
        (s3.putObject().promise).mockReset()
    })

    it('File has been gotten', async () => {
        expect(jest.isMockFunction(s3.putObject)).toBeTruthy()
        expect(jest.isMockFunction(s3.putObject().promise)).toBeTruthy()
        const inventory = {}
        const val = {
            ETag: "123",
            VersionId: "ABC"
        }
        s3.putObject().promise.mockResolvedValueOnce(val)

        const res = await cloud.save("BucketName", "MyKey", inventory)
        expect(res).toBeTruthy()
        expect(res).toEqual(val)
        expect(s3.putObject).toBeCalledWith({
            Bucket: "BucketName", 
            Key: `history/MyKey/${moment().tz('America/New_York').format('MM-DD-YYYY HH:MM')}.json`,
            Body: "{}"
        })
        expect(s3.putObject().promise).toBeCalledTimes(1)
    })
})