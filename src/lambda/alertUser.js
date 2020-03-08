const cloud = require('../api/aws')
const utils = require('../api/utils')

exports.handler = async (event) => {
    const user = event.workList.shift()
    
    const codes = await utils.getUserCodes(event.bucket, user)
    
    const msg = await utils.build(event.bucket, codes)
    
    if (event.send === true) {
        await cloud.send(user.topic, msg)
    }
    console.log(msg)
    
    event.next = event.workList[0]
    
    return event;
};



