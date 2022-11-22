const { get, find, isUndefined } = require("lodash");

const precisions = require("../assets/precisions");

module.exports = async ({ ticker, binance }) => {
	if (isUndefined(precisions[ticker]) === true) {
		const exchange = await binance.futuresExchangeInfo();
		const symbols = get(exchange, "symbols", []);
		const symbol = find(symbols, (i) => i.symbol === ticker);

		return get(symbol, "quantityPrecision", 0);
	} else {
		return precisions[ticker];
	}
};
