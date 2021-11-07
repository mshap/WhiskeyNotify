const cloud = require('./aws')
const listUsers = async Bucket => {
	const users = await cloud.get(Bucket, 'users.json')

	return users.map(u => u.name)
}

const listProducts = async (user, Bucket) => {
	const products = await cloud.get(Bucket, 'products.json')

	return products.filter(p => p.notify.includes(user)).map(p => p.name)
}

module.exports = {
	users: listUsers,
	products: listProducts
}
