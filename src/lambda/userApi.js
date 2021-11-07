const gateway = require('../api/gateway')

const list = async event => {
	const bucket = process.env.BUCKET_NAME
	const users = await gateway.users(bucket)

	let response = {
		statusCode: 200,
		headers: {
			'x-custom-header': 'my custom header value'
		},
		body: JSON.stringify(users)
	}

	return response
}

const products = async event => {
	const bucket = process.env.BUCKET_NAME
	const products = await gateway.products(event.pathParameters.user, bucket)

	let response = {
		statusCode: 200,
		headers: {
			'x-custom-header': 'my custom header value'
		},
		body: JSON.stringify(products)
	}

	return response
}

module.exports = {
	list: list,
	products: products
}
