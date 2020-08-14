import { ok, notFound, badRequest } from 'wix-http-functions';
import wixData from 'wix-data';

// URL to call this HTTP function from your published site looks like: 
// Premium site - https://mysite.com/_functions/example/multiply?leftOperand=3&rightOperand=4
// Free site - https://username.wixsite.com/mysite/_functions/example/multiply?leftOperand=3&rightOperand=4

// URL to test this HTTP function from your saved site looks like:
// Premium site - https://mysite.com/_functions-dev/example/multiply?leftOperand=3&rightOperand=4
// Free site - https://username.wixsite.com/mysite/_functions-dev/example/multiply?leftOperand=3&rightOperand=4

// test - https://www.mochee.co.uk/_functions-dev/googleMerchantCentreData
export function get_googleMerchantCentreData(request) {
	// Response object with content type set
	const response = {
		"headers": {
			"Content-Type": "application/json"
		}
	};
	// get wixData query
	let queryProducts = wixData.query("Stores/Products").find()
	// Answer query promise
	return queryProducts.then(results => {
		// return list of products in response
		if (results.items.length > 0) {
			let itemList = results.items.map(f => 
				createMerchantObject(f)
			)

			response.body = itemList

			return ok(response)
		}
		// nothing found -  return not found 404 error
		return notFound(response)
	}, error => {
		// error trying to execute query - return 400 error
		response.body = {
			"error": error
		}
		return badRequest(response)
	})
}

function createMerchantObject(item) {
	let obj = {
		"id": item._id,  //M
		"offerId": item._id,
		"title": item.name, //M
		"description": item.description, //M 
		"link": "https://www.mochee.co.uk".concat(item.productPageUrl), //M
		"imageLink": "https://static.wixstatic.com/media".concat(item.mediaItems[0].id), //M
		"additionalImageLinks": item.mediaItems.map(f => 
				"https://static.wixstatic.com/media".concat(f.id)
			),
		"contentLanguage": "en",
		// "targetCountry": string,
		// "channel": string,
		// "expirationDate": string,
		// "adult": boolean,
		"ageGroup": "adult", //M
		// "kind": string,
		"availability": getStockString(item.inStock), //M
		"brand": "Mochee", //M
		// "color": "", //M
		"condition": "new", //M
		"gender": "male", //M
		"googleProductCategory": "Clothing & Accessories > Clothing > Outerwear > Coats & Jackets", //M
		// "gtin": string,
		// "itemGroupId": string,
		// "material": "",
		"mpn": item._id, //M
		// "pattern": "",
		"price": {
			"value": item.price, //M
			"currency": item.currency //M
		},
		// "productType": string,
		"salePrice": {
			"value": item.discountedPrice,
			"currency": item.currency
		},
		// "salePriceEffectiveDate": string,
		// "shipping": [
		// 	{
		// 	object (ProductShipping)
		// 	}
		// ],
		// "shippingWeight": {
		// 	object (ProductShippingWeight)
		// },
		"sizes": getSizesFromProductInfo(item.productOptions)
		// ,
		// "taxes": [
		// 	{
		// 	object (ProductTax)
		// 	}
		// ],
		// "adwordsGrouping": string,
		// "adwordsLabels": [
		// 	string
		// ],
		// "adwordsRedirect": string,
		// "destinations": [
		// 	{
		// 	object (ProductDestination)
		// 	}
		// ],
		// "validatedDestinations": [
		// 	string
		// ],
		// "customAttributes": [
		// 	{
		// 	object (CustomAttribute)
		// 	}
		// ],
		// "customGroups": [
		// 	{
		// 	object (CustomGroup)
		// 	}
		// ],
		// "warnings": [
		// 	{
		// 	object (Error)
		// 	}
		// ],
		// "energyEfficiencyClass": string,
		// "identifierExists": boolean,
		// "installment": {
		// 	object (Installment)
		// },
		// "loyaltyPoints": {
		// 	object (LoyaltyPoints)
		// },
		// "onlineOnly": boolean,
		// "multipack": string,
		// "customLabel0": string,
		// "customLabel1": string,
		// "customLabel2": string,
		// "customLabel3": string,
		// "customLabel4": string,
		// "isBundle": boolean,
		// "mobileLink": string,
		// "availabilityDate": string,
		// "sizeSystem": string,
		// "sizeType": string,
		// "shippingLabel": string,
		// "unitPricingMeasure": {
		// 	object (ProductUnitPricingMeasure)
		// },
		// "unitPricingBaseMeasure": {
		// 	object (ProductUnitPricingBaseMeasure)
		// },
		// "shippingLength": {
		// 	object (ProductShippingDimension)
		// },
		// "shippingWidth": {
		// 	object (ProductShippingDimension)
		// },
		// "shippingHeight": {
		// 	object (ProductShippingDimension)
		// },
		// "displayAdsId": string,
		// "displayAdsSimilarIds": [
		// 	string
		// ],
		// "displayAdsTitle": string,
		// "displayAdsLink": string,
		// "displayAdsValue": number,
		// "aspects": [
		// 	{
		// 	object (ProductAspect)
		// 	}
		// ],
		// "sellOnGoogleQuantity": string,
		// "promotionIds": [
		// 	string
		// ],
		// "additionalProductTypes": [
		// 	string
		// ],
		// "maxHandlingTime": string,
		// "minHandlingTime": string,
		}
	return obj
}

// test - https://www.mochee.co.uk/_functions-dev/googleMerchantCentreDataText
export function get_googleMerchantCentreDataText(request) {
	// Response object with content type set
	const response = {
		"headers": {
			"Content-Type": "text/plain"
		}
	};
	// get wixData query
	let queryProducts = wixData.query("Stores/Products").find()
	// Answer query promise
	return queryProducts.then(results => {
		// return list of products in response
		if (results.items.length > 0) {
			// create headers
			const headers = ["id","title","description","link","condition","price","availability","image link","mpn","brand","google product category","shipping","gender","age group","size","color"]
			// create text array to of lines
			var textArray = []
			// add headers to array
			textArray.push(headers.join("|"))

			results.items.forEach(f =>{
				const currentLine = createItemsDelimited(f).join("|")
				textArray.push(currentLine)
			})

			response.body = textArray.join("\n")

			return ok(response)
		}
		// nothing found -  return not found 404 error
		return notFound(response)
	}, error => {
		// error trying to execute query - return 400 error
		response.body = {
			"error": error
		}
		return badRequest(response)
	})
}

function createItemsDelimited(item) {
	let obj = [
		item._id,  //M "id": 
		item.name, //M "title": 
		item.description, //M "description": 
		"https://www.mochee.co.uk".concat(item.productPageUrl), //M "link": 
		"new", //M "condition": 
		`${item.price} ${item.currency}`, // "price": 
		getStockString(item.inStock), //M "availability": 
		"https://static.wixstatic.com/media".concat(item.mediaItems[0].id), //M "imageLink": 
		item._id, //M "mpn": 
		"Mochee Kent", //M "brand": 
		"Clothing & Accessories > Clothing > Outerwear > Coats & Jackets", //M "gpc": 
		"GB::Express DHL UK:9.99 GBP", //"shipping": 
		"male", //M "gender": 
		"adult", //M "ageGroup": 
		getSizesFromProductInfoAsString(item.productOptions), //M "sizes"
		"Black"
	]
	return obj
}

function getObjectLis (parameter) {
	
}

function getSizesFromProductInfoAsString(productOptions){
	try {
		let choiceList = productOptions.Size.choices;
		choiceList.pop();
		let size =  choiceList.map(f => f.value.split(' (')[0])
		console.log(size)
		return size.join(",")
	} catch (err) {
		console.log(err)
		return ""
	}

}

function getSizesFromProductInfo(productOptions){
	try {
		let choiceList = productOptions.Size.choices;
		choiceList.pop();
		let size =  choiceList.map(f => f.value.split(' (')[0])
		console.log(size)
		return size
	} catch (err) {
		console.log(err)
		return ""
	}

}

function getStockString(bool){
	if (bool === true) {
		return "in_stock"
	}else{
		return "out_of_stock"
	}
}
