const cloud = require('../api/aws')

exports.handler = async (event) => {
    let list = await cloud.get(event.bucket, event.inputFile)

    list.push('SENTINEL')
    
    event.workList = list
    event.next = list[0]
    
    return event
};