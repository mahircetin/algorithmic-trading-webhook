"use strict";

const { get, isUndefined } = require("lodash");

const fetch = require("../../functions/fetch");

module.exports = async ({ binance, ...context }) => {
	let set;

	const { ticker, quantity } = await fetch({ ...context, binance });

	if (quantity > 0) {
		const counter = quantity > 0 ? "SELL" : "BUY";

		set = await binance.futuresOrder(counter, ticker, quantity, false, {
			reduceOnly: true,
		});

		if (isUndefined(get(set, "orderId"))) {
			console.error("Cannot close previous position:", get(set, "code"));

			return false;
		}
	}

	return set;
};
