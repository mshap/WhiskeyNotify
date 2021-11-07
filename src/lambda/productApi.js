const gateway = require('../api/gateway')

const list = async event => {
	const bucket = process.env.BUCKET_NAME
	const users = await gateway.products(bucket)

	let response = {
		statusCode: 200,
		headers: {
			'x-custom-header': 'my custom header value'
		},
		body: JSON.stringify(users)
	}

	return response
}

module.exports = {
	list: list
}
