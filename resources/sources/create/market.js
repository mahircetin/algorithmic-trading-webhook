"use strict";

const { get, size, isUndefined } = require("lodash");

const createStop = require("./stop");
const createLimit = require("./limit");

module.exports = async (context) => {
	let set, setStop, setProfit;
	const { side, ticker, quantity, stop, profit, binance } = context;

	if ((await createStop({ ...context, type: "STOP" })) !== false) {
		set = await binance.futuresOrder(side, ticker, quantity);
	}

	if (isUndefined(get(set, "orderId")) === false) {
		const counter = side === "SELL" ? "BUY" : "SELL";

		setStop = await createLimit({
			...context,
			type: "STOP",
			side: counter,
			price: stop,
			stop: stop,
		});

		setProfit = await createLimit({
			...context,
			type: "TAKE_PROFIT",
			side: counter,
			price: profit,
			stop: profit,
		});
	} else {
		console.error("Cannot open position:", get(set, "code"));
	}

	return { set, setStop, setProfit };
};
