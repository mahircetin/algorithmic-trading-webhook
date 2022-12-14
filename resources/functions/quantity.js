"use strict";

const { get, find, isUndefined } = require("lodash");

const getPrecisions = require("./precision");

// MARKET | get price from exchange and calculate margin
// LIMIT | get price from request body and calculate margin
// CLOSE, STOP_MARKET, TAKE_PROFIT_MARKET order | get previous order quantity and calculate margin

module.exports = async ({
	type,
	ticker,
	risk,
	price,
	stop,
	amount,
	asset,
	account,
	binance,
}) => {
	let margin;

	const assets = get(account, "assets", []);
	const positions = get(account, "positions", []);
	const collateral = find(assets, (i) => i.asset === asset);
	const position = find(positions, (i) => i.symbol === ticker);
	const balance = get(collateral, "availableBalance", 0);
	const leverage = get(position, "leverage", 1);

	const precision = await getPrecisions({ ticker, binance });

	if (type === "OPEN" && isUndefined(price))
		price = get(await binance.futuresPrices(), ticker);

	if (
		type === "OPEN" &&
		isUndefined(risk) === false &&
		isUndefined(stop) === false
	) {
		margin = ((balance / 100) * risk) / Math.abs(price - stop);
	} else if (type === "OPEN") {
		margin = (balance * leverage) / price;
	} else {
		margin = (get(position, "positionAmt", 0) * amount) / 100;
	}

	return Math.round(margin * 10 ** precision) / 10 ** precision;
};
