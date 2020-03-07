const AWS = require('aws-sdk')
const moment = require('moment-timezone')

const s3 = new AWS.S3();
const sns = new AWS.SNS();

const getProductKey = (code, adjust) => {
    return `history/${code}/${moment().tz('America/New_York').add(adjust, 'days').format('MM-DD-YYYY')}.json`
}

const storeProduct = async (bucket, code, inventory) => {
    const key = getProductKey(code)

    const params = {
         Bucket: bucket, // pass your bucket name
         Key: key, // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(inventory)
     };
     const save = await s3.putObject(params).promise();
     
     console.log(`File uploaded successfully at history/${code}.json`)
}

const getProduct = async (Bucket, code, adjust = 0) => {
    try {
        return await getFile(Bucket, getProductKey(code, adjust))
    } catch (err) {
        return {
            totalQuantity: 0
        }
    }
}

const getFile = async (Bucket, Key) => {
    const params = {
        Bucket,
        Key
    };

    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString())    
}

const send = async (TopicArn, Message) => {   
    if (Message === "") {
        console.log(`Nothing to send to ${TopicArn}`)
        return
    }
    
    const params = {
      Message,
      Subject: "New whiskey found!" ,
      TopicArn
    }
    
    const sent = await sns.publish(params).promise()
    
    console.log(sent)
}

module.exports = {
    save: storeProduct,
    get: getFile,
    getProduct: getProduct,
    send: send
}
