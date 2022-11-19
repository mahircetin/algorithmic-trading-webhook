"use strict";

const { get, isUndefined } = require("lodash");

module.exports = async ({
	type,
	side,
	ticker,
	quantity,
	price,
	stop,
	binance,
}) => {
	let set;

	const order = await binance.futuresOpenOrders(ticker);

	order.forEach(async (index) => {
		if (type === index.type) {
			await binance.futuresCancel(ticker, { orderId: index.orderId });
		}
	});

	if (isUndefined(stop) === false) {
		set = await binance.futuresOrder(side, ticker, quantity, price, {
			type,
			stopPrice: stop,
			reduceOnly: true,
		});

		if (isUndefined(get(set, "orderId")) === true) {
			console.error("Cannot open stop limit:", get(set, "code"));

			return false;
		}
	}

	return set;
};
