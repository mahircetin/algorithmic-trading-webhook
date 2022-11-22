"use strict";

const { get, isUndefined } = require("lodash");

const fetch = require("../../functions/fetch");

module.exports = async ({ binance, ...context }) => {
	const { type, side, ticker, quantity, price } = await fetch({
		...context,
		binance,
	});

	(await binance.futuresOpenOrders(ticker)).forEach(async (index) => {
		if (type === index.type) {
			await binance.futuresCancel(ticker, {
				orderId: index.orderId.toString(),
			});
		}
	});

	const set = await binance.futuresOrder(side, ticker, quantity, false, {
		type,
		stopPrice: price,
		reduceOnly: true,
	});

	if (isUndefined(get(set, "orderId"))) {
		console.error("Cannot open stop limit:", get(set, "code"));

		return false;
	}

	return set;
};
