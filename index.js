const express = require("express");
const Binance = require("node-binance-api");
const { get, includes } = require("lodash");

const orderClose = require("./resources/sources/order/close");
const orderOpen = require("./resources/sources/order/open");
const orderSetup = require("./resources/sources/order/setup");

const { ASSET, APIKEY, APISECRET } = process.env;

const server = express();
const binance = new Binance().options({
	APIKEY,
	APISECRET,
});

server.use(express.json());

server.post("/", async (request, response) => {
	const account = await binance.futuresAccount();

	const type = get(request, "body.type", "MARKET");
	const side = get(request, "body.side", "BUY");
	const ticker = get(request, "body.ticker", "BTCUSDT");
	const risk = get(request, "body.risk");
	const price = get(request, "body.price");
	const amount = get(request, "body.amount", 100);
	const stop = get(request, "body.scopes.stop");
	const profit = get(request, "body.scopes.profit");

	const params = { type, side, ticker, risk, price, amount, stop, profit };
	const context = { params, asset: ASSET, account, binance };

	const closing = { ...context, params: { ...params, type: "CLOSE" } };

	if (type === "OPEN" && (await orderClose(closing)) !== false) {
		response.send(await orderOpen(context));
	} else if (type === "CLOSE") {
		response.send(await orderClose(context));
	} else if (includes(["STOP_MARKET", "TAKE_PROFIT_MARKET"], type)) {
		response.send(await orderSetup(context));
	} else {
		response.send({});
	}
});

server.listen(process.env.PORT || 3000);
