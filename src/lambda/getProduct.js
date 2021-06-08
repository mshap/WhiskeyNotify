const abc = require('../api/vaabc')

/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core')
// i18n library dependency, we use it below in a localisation interceptor
const i18n = require('i18next')
// i18n strings for all supported locales
const languageStrings = require('./languageStrings')

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
		)
	},
	handle(handlerInput) {
		const speakOutput = handlerInput.t('WELCOME_MSG')

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse()
	}
}

const GetLocationIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetLocationIntent'
		)
	},
	handle(handlerInput) {
		const storeId =
			handlerInput.attributesManager.getSessionAttributes().storeId

		let msg = null
		let repromt_msg = 'SEARCH_PROMPT'

		if (storeId) {
			msg = handlerInput.t('LOCATION_MSG', { storeId: storeId })
		} else {
			msg = handlerInput.t('NO_LOCATION_MSG')
			repromt_msg = 'NO_LOCATION_MSG'
		}

		return handlerInput.responseBuilder
			.speak(msg)
			.reprompt(handlerInput.t(repromt_msg))
			.getResponse()
	}
}

const SetLocationIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetLocationIntent'
		)
	},
	async handle(handlerInput) {
		const storeId = Alexa.getSlotValue(handlerInput.requestEnvelope, 'storeId')

		if (isNaN(storeId)) {
			return (
				handlerInput.responseBuilder
					.speak(handlerInput.t('INVALIDLOCATION_MSG'))
					// .reprompt(handlerInput.t('SEARCH_PROMPT'))
					.withShouldEndSession(true)
					.getResponse()
			)
		}

		const sessionAttributes =
			handlerInput.attributesManager.getSessionAttributes()
		sessionAttributes.storeId = storeId
		handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

		return handlerInput.responseBuilder
			.speak(handlerInput.t('SET_LOCATION_MSG', { storeId: storeId }))
			.reprompt(handlerInput.t('SEARCH_PROMPT'))
			.getResponse()
	}
}

const FindWhiskeyIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'FindWhiskeyIntent'
		)
	},
	async handle(handlerInput) {
		const productCode = Alexa.getSlotValue(
			handlerInput.requestEnvelope,
			'productCode'
		)
		const sessionAttributes =
			handlerInput.attributesManager.getSessionAttributes()

		let json = null

		if (sessionAttributes.storeId) {
			json = await abc.getProduct(productCode, sessionAttributes.storeId)
		} else {
			json = await abc.getProduct(productCode)
		}

		const inventory = abc.inventory(json.products[0])
		let msg = handlerInput.t('NO_STOCK_MSG')
		let endSession = false

		if (inventory.totalQuantity > 0) {
			msg = handlerInput.t('IN_STOCK_MSG', {
				bottles: inventory.totalQuantity,
				stores: inventory.stores.length
			})
			sessionAttributes.inventory = inventory
		} else {
			sessionAttributes.inventory == null
			endSession = true
		}

		handlerInput.attributesManager.setSessionAttributes(sessionAttributes)

		return handlerInput.responseBuilder
			.speak(msg)
			.reprompt(handlerInput.t('STORE_PROMPT'))
			.withShouldEndSession(endSession)
			.getResponse()
	}
}

const ListStoresIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'ListStoresIntent'
		)
	},
	handle(handlerInput) {
		const inventory =
			handlerInput.attributesManager.getSessionAttributes().inventory

		let msg = null

		if (inventory) {
			msg = inventory.stores.reduce((buildMsg, store) => {
				return `${buildMsg} ${handlerInput.t('STORES_MSG', {
					name: store.name,
					description: store.description,
					address: store.address,
					quantity: store.quantity,
					phone: store.phone
				})}`
			}, '')
		} else {
			msg = handlerInput.t('NO_STOCK_MSG')
		}

		return (
			handlerInput.responseBuilder
				.speak(msg)
				.withShouldEndSession(true)
				// .reprompt(handlerInput.t('SEARCH_PROMPT'))
				.getResponse()
		)
	}
}

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
		)
	},
	handle(handlerInput) {
		const speakOutput = handlerInput.t('HELP_MSG')

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse()
	}
}

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			(Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'AMAZON.CancelIntent' ||
				Alexa.getIntentName(handlerInput.requestEnvelope) ===
					'AMAZON.StopIntent')
		)
	},
	handle(handlerInput) {
		const speakOutput = handlerInput.t('GOODBYE_MSG')

		handlerInput.attributesManager.setSessionAttributes({})

		return handlerInput.responseBuilder.speak(speakOutput).getResponse()
	}
}
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet
 * */
const FallbackIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'AMAZON.FallbackIntent'
		)
	},
	handle(handlerInput) {
		const speakOutput = handlerInput.t('FALLBACK_MSG')

		return (
			handlerInput.responseBuilder
				.speak(speakOutput)
				.withShouldEndSession(true)
				// .reprompt(speakOutput)
				.getResponse()
		)
	}
}
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs
 * */
const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
			'SessionEndedRequest'
		)
	},
	handle(handlerInput) {
		console.log(
			`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`
		)
		// Any cleanup logic goes here.
		handlerInput.attributesManager.setSessionAttributes({})

		return handlerInput.responseBuilder.getResponse() // notice we send an empty response
	}
}
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents
 * by defining them above, then also adding them to the request handler chain below
 * */
const IntentReflectorHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
		)
	},
	handle(handlerInput) {
		const intentName = Alexa.getIntentName(handlerInput.requestEnvelope)
		const speakOutput = handlerInput.t('REFLECTOR_MSG', {
			intentName: intentName
		})

		return (
			handlerInput.responseBuilder
				.speak(speakOutput)
				//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse()
		)
	}
}
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below
 * */
const ErrorHandler = {
	canHandle() {
		return true
	},
	handle(handlerInput, error) {
		const speakOutput = handlerInput.t('ERROR_MSG')
		console.log(`~~~~ Error handled: ${JSON.stringify(error)}`)

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse()
	}
}

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
	process(handlerInput) {
		i18n
			.init({
				lng: Alexa.getLocale(handlerInput.requestEnvelope),
				resources: languageStrings
			})
			.then(t => {
				handlerInput.t = (...args) => t(...args)
			})
	}
}
/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom
 * */
exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		FindWhiskeyIntentHandler,
		SetLocationIntentHandler,
		GetLocationIntentHandler,
		ListStoresIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		FallbackIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler
	)
	.addErrorHandlers(ErrorHandler)
	.addRequestInterceptors(LocalisationRequestInterceptor)
	.lambda()
