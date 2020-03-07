const cloud = require('../api/aws')
const utils = require('../api/utils')


exports.handler = async (event) => {
    const user = event.currentWorkItem;
    
    const codes = await utils.getUserCodes(event.bucket, user)
    
    const msg = await utils.build(event.bucket, codes)
    
    await cloud.send(user.topic, msg)
    console.log(msg)
    
    return event;
};



