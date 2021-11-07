const cloud = require('./aws')
const listUsers = async Bucket => {
	const users = await cloud.get(Bucket, 'users.json')

	return mapByName(users)
}

const listUserProducts = async (user, Bucket) => {
	const products = await cloud.get(Bucket, 'products.json')

	return mapByName(products.filter(p => p.notify.includes(user)))
}

const listProducts = async Bucket => {
	const products = await cloud.get(Bucket, 'products.json')

	return mapByName(products)
}

const mapByName = list => {
	return list.map(i => i.name)
}

module.exports = {
	users: listUsers,
	userProducts: listUserProducts,
	products: listProducts
}
