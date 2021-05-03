const cloud = require('../api/aws')

exports.handler = async (event) => {
    let users = await cloud.get(event.bucket, 'users.json')

    users.push('SENTINEL')
    
    event.workList = users
    event.next = users[0]
    
    return event
};