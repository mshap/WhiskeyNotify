const AWS = require('aws-sdk')
const moment = require('moment-timezone')

const getProductKey = (code, adjust) => {
    return `history/${code}/${moment().tz('America/New_York').add(adjust, 'days').format('MM-DD-YYYY HH:MM')}.json`
}

const storeProduct = async (bucket, code, inventory) => {
    const s3 = new AWS.S3();

    const key = getProductKey(code)

    inventory.time = moment().tz('America/New_York').format('MM-DD-YYYY HH:MM')

    const params = {
         Bucket: bucket, // pass your bucket name
         Key: key, // file will be saved as testBucket/contacts.csv
         Body: JSON.stringify(inventory)
     };
     const save = await s3.putObject(params).promise();
     
     console.log(`File uploaded successfully at history/${code}.json`)

     return save
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
    const s3 = new AWS.S3();

    const params = {
        Bucket,
        Key
    };

    const data = await s3.getObject(params).promise();
    return JSON.parse(data.Body.toString())    
}

const listLatest = async (Bucket, code) => {
    const s3 = new AWS.S3();

    const params = {
        Bucket,
        Prefix: `history/${code}`
    };

    const data = await s3.listObjects(params).promise();
    
    const keys = data.Contents.sort((a, b) => {
        const aDate = new Date(a.LastModified)
        const bDate = new Date(b.LastModified)
        
        return (aDate > bDate) ? -1 : 1
    }).map(obj => obj.Key)
      .splice(0,2)
      
  return keys;
}

const send = async (TopicArn, Message) => {   
    const sns = new AWS.SNS();

    if (Message === "") {
        console.log(`Nothing to send to ${TopicArn}`)
        return null
    }
    
    const params = {
      Message,
      Subject: "New whiskey found!" ,
      TopicArn
    }
    
    const sent = await sns.publish(params).promise()
    
    console.log(sent)

    return sent
}

module.exports = {
    save: storeProduct,
    get: getFile,
    getProduct: getProduct,
    list: listLatest,
    send: send
}
