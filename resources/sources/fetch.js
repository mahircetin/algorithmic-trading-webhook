"use strict";

const { get, find, isUndefined } = require("lodash");

const precisions = require("../assets/precisions");

module.exports = async ({ request, asset, binance }) => {
	let margin;

	const ticker = get(request, "body.ticker", "BTCBUSD");
	const risk = get(request, "body.risk", 1);
	const price = get(request, "body.price");

	const account = await binance.futuresAccount();
	const assets = get(account, "assets", []);
	const positions = get(account, "positions", []);
	const collateral = find(assets, (i) => i.asset === asset);
	const position = find(positions, (i) => i.symbol === ticker);
	const balance = get(collateral, "availableBalance", 0);
	const leverage = get(position, "leverage", 1);

	if (isUndefined(price) === true) {
		const prices = await binance.futuresPrices();
		const mark = get(prices, ticker);

		margin = (((balance * risk) / 100) * leverage) / mark;
	} else {
		margin = (((balance * risk) / 100) * leverage) / price;
	}

	const precision = precisions[ticker];
	const quantity = Math.round(margin * 10 ** precision) / 10 ** precision;

	return {
		type: get(request, "body.type", "MARKET"),
		side: get(request, "body.side", "BUY"),
		ticker,
		quantity,
		price,
		stop: get(request, "body.params.stop"),
		profit: get(request, "body.params.profit"),
		position,
		binance,
	};
};
