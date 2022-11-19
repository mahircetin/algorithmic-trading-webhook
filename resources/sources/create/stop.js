"use strict";

const { get, isUndefined } = require("lodash");

module.exports = async ({ ticker, position, binance }) => {
	let set;

	const quantity = get(position, "positionAmt", 0);
	const counter = quantity > 0 ? "SELL" : "BUY";

	if (quantity != 0) {
		set = await binance.futuresOrder(counter, ticker, quantity, false, {
			reduceOnly: true,
		});

		if (isUndefined(get(set, "orderId")) === true) {
			console.error("Cannot close previous position:", get(set, "code"));

			return false;
		}
	}

	return set;
};
