const abc = require('../api/vaabc')
const cloud = require('../api/aws')

exports.handler = async (event) => {
    const json = await abc.getProduct(event.currentWorkItem.code)

    const inventory = abc.inventory(json.products[0], event.currentWorkItem.name)

    await cloud.save(event.bucket, event.currentWorkItem.code, inventory)

    return event;

};
