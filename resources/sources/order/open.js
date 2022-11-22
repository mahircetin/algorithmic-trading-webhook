"use strict";

const { get, isUndefined } = require("lodash");

const fetch = require("../../functions/fetch");
const createClose = require("./close");
const orderSetup = require("./setup");

module.exports = async ({ binance, ...context }) => {
	let setStop, setProfit;

	const { side, ticker, quantity, price, stop, profit } = await fetch({
		...context,
		binance,
	});

	const set = await binance.futuresOrder(side, ticker, quantity, price);

	if (isUndefined(get(set, "orderId")) === false) {
		const counter = side === "SELL" ? "BUY" : "SELL";

		if (isUndefined(stop) === false) {
			setStop = await orderSetup({
				...context,
				params: {
					...context.params,
					type: "STOP_MARKET",
					side: counter,
					price: stop,
					quantity,
				},
				binance,
			});
		}

		if (isUndefined(profit) === false) {
			setProfit = await orderSetup({
				...context,
				params: {
					...context.params,
					type: "TAKE_PROFIT_MARKET",
					side: counter,
					price: profit,
					quantity,
				},
				binance,
			});
		}
	}

	return { set, setStop, setProfit };
};
