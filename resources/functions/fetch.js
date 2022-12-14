"use strict";

const { get, find, isUndefined } = require("lodash");

const getQuantity = require("./quantity");

module.exports = async ({ params, asset, account, binance }) => {
	const type = get(params, "type");
	const side = get(params, "side");
	const ticker = get(params, "ticker");
	const price = get(params, "price");
	const stop = get(params, "stop");
	let quantity = get(params, "quantity");

	quantity = isUndefined(quantity)
		? await getQuantity({
				type,
				ticker,
				risk: get(params, "risk"),
				price,
				stop,
				amount: get(params, "amount"),
				asset,
				account,
				binance,
		  })
		: quantity;

	console.info("Webhook has been started;");
	console.info(type, side, ticker, quantity);

	return {
		type,
		side,
		ticker,
		quantity,
		price,
		stop,
		profit: get(params, "profit"),
	};
};
