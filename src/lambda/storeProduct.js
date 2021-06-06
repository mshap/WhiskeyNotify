const abc = require('../api/vaabc')
const cloud = require('../api/aws')

exports.handler = async event => {
	const workItem = event.workList.shift()

	const json = await abc.getProduct(workItem.code)

	const inventory = abc.inventory(json.products[0])
	inventory.name = workItem.name

	await cloud.save(event.bucket, workItem.code, inventory)

	event.next = event.workList[0]

	return event
}
