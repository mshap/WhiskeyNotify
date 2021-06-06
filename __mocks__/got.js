const products = require('../__tests__/data/products.json')

const productQueryString = '&productCode='

const got = url => {
	return new Promise((resolve, reject) => {
		const prodId = url.substr(
			url.indexOf(productQueryString) + productQueryString.length,
			6
		)

		let product = {}

		if (products[prodId] === undefined) {
			product = products['empty']
			product.products[0].productId = prodId
		} else {
			product = products[prodId]
		}

		process.nextTick(() => resolve(product))
	})
}

module.exports = got
