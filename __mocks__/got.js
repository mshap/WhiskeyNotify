const products = {
    "empty": {"products":[{"productId": "0","storeInfo":{"storeId":331,"quantity":0,"distance":0,"latitude":37.648441,"longitude":-77.61582,"address":"3450-3452 Pump Road Suites 21 and 22 Henrico VA 23233","PhoneNumber":{"AreaCode":"804","Prefix":"360","LineNumber":"2528","FormattedPhoneNumber":"(804) 360-2528"},"url":"/stores/331","address1":"3450-3452 Pump Road","address2":"Suites 21 and 22","city":"Henrico","state":"VA","zip":"23233","hours":"Mon-Sat 12-10 pm /  Su 12-7 pm","shoppingCenter":"Short Pump Crossing Shopping Center","closeForEcommerce":0,"counterService":false,"wholesale":false},"nearbyStores":[]}]},
    "019880": {"products":[{"productId":"019880","storeInfo":{"storeId":331,"quantity":5,"distance":0,"latitude":37.648441,"longitude":-77.61582,"address":"3450-3452 Pump Road Suites 21 and 22 Henrico VA 23233","PhoneNumber":{"AreaCode":"804","Prefix":"360","LineNumber":"2528","FormattedPhoneNumber":"(804) 360-2528"},"url":"/stores/331","address1":"3450-3452 Pump Road","address2":"Suites 21 and 22","city":"Henrico","state":"VA","zip":"23233","hours":"Mon-Sat 12-10 pm /  Su 12-7 pm","shoppingCenter":"Short Pump Crossing Shopping Center","closeForEcommerce":0,"counterService":false,"wholesale":false},"nearbyStores":[{"storeId":205,"quantity":6,"distance":1.8,"latitude":37.62304,"longitude":-77.622986,"address":"2288 John Rolfe Parkway Unit 16 Richmond VA 23233","PhoneNumber":{"AreaCode":"804","Prefix":"364","LineNumber":"8915","FormattedPhoneNumber":"(804) 364-8915"},"url":"/stores/205","address1":"2288 John Rolfe Parkway","address2":"Unit 16","city":"Richmond","state":"VA","zip":"23233","hours":"Mon-Sat 12-7 pm /  Su 12-7 pm","shoppingCenter":"John Rolfe Commons Shopping Center","closeForEcommerce":0,"counterService":false,"wholesale":false},{"storeId":247,"quantity":5,"distance":2.9,"latitude":37.640499,"longitude":-77.564229,"address":"9685 West Broad Street Glen Allen VA 23060","PhoneNumber":{"AreaCode":"804","Prefix":"527","LineNumber":"4210","FormattedPhoneNumber":"(804) 527-4210"},"url":"/stores/247","address1":"9685 West Broad Street","address2":null,"city":"Glen Allen","state":"VA","zip":"23060","hours":"Mon-Sat 12-9 pm /  Su 12-7 pm","shoppingCenter":"Westpark Shopping Center","closeForEcommerce":0,"counterService":false,"wholesale":false},{"storeId":366,"quantity":14,"distance":3.3,"latitude":37.605143,"longitude":-77.59131,"address":"1370 Gaskins Road RICHMOND VA 23233","PhoneNumber":{"AreaCode":"804","Prefix":"754","LineNumber":"4024","FormattedPhoneNumber":"(804) 754-4024"},"url":"/stores/366","address1":"1370 Gaskins Road","address2":null,"city":"RICHMOND","state":"VA","zip":"23233","hours":"Mon-Sat 12-9 pm /  Su 12-7 pm","shoppingCenter":"Gayton Crossing Center Cntr","closeForEcommerce":0,"counterService":false,"wholesale":false},{"storeId":292,"quantity":8,"distance":4.2,"latitude":37.603599,"longitude":-77.563354,"address":"1521 Parham Road Richmond VA 23229-4604","PhoneNumber":{"AreaCode":"804","Prefix":"662","LineNumber":"9053","FormattedPhoneNumber":"(804) 662-9053"},"url":"/stores/292","address1":"1521 Parham Road","address2":null,"city":"Richmond","state":"VA","zip":"23229-4604","hours":"Mon-Sat 12-9 pm /  Su 12-7 pm","shoppingCenter":"Ridge Shopping Center","closeForEcommerce":0,"counterService":false,"wholesale":false},{"storeId":171,"quantity":9,"distance":4.3,"latitude":37.632907,"longitude":-77.540336,"address":"8700 West Broad Street Richmond VA 23294","PhoneNumber":{"AreaCode":"804","Prefix":"527","LineNumber":"4421","FormattedPhoneNumber":"(804) 527-4421"},"url":"/stores/171","address1":"8700 West Broad Street","address2":null,"city":"Richmond","state":"VA","zip":"23294","hours":"Mon-Sat 12-10 pm /  Su 12-7 pm","shoppingCenter":null,"closeForEcommerce":0,"counterService":false,"wholesale":false}]}]},
    "111111": {"products":[{"productId": "111111","storeInfo":{"storeId":111,"quantity":6,"distance":0,"latitude":37.648441,"longitude":-77.61582,"address":"123 Main St","PhoneNumber":{"AreaCode":"804","Prefix":"360","LineNumber":"2528","FormattedPhoneNumber":"(555) 555-5555"},"url":"/stores/331","address1":"3450-3452 Pump Road","address2":"Suites 21 and 22","city":"Henrico","state":"VA","zip":"23233","hours":"Mon-Sat 12-10 pm /  Su 12-7 pm","shoppingCenter":"Test Center","closeForEcommerce":0,"counterService":false,"wholesale":false},"nearbyStores":[]}]},
}

const productQueryString = '&productCode='

const got = (url) => {
    return new Promise((resolve, reject) => {
        const prodId = url.substr(url.indexOf(productQueryString) + productQueryString.length, 6)

        let product = {}

        if(products[prodId] === undefined) {
            product = products["empty"]
            product.products[0].productId = prodId
        } else {
            product = products[prodId]
        }
        
        process.nextTick(() => resolve(product))
    })
}

module.exports = got