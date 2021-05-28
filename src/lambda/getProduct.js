const abc = require('../api/vaabc')

exports.handler = async (event) => {
    const json = await abc.getProduct(event.productCode)

    const inventory = abc.inventory(json.products[0])
    //inventory.name = workItem.name

    event.product = inventory

    return event;

};
