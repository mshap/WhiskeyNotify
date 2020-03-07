const utils = require('../api/aws')

exports.handler = async (event) => {
    let users = await utils.get(event.bucket, 'users.json')

    users.push('SENTINEL')
    return users;
};