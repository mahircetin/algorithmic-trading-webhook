const express = require("express");
const Binance = require("node-binance-api");
const { size } = require("lodash");

const fetch = require("./resources/sources/fetch");
const createStop = require("./resources/sources/create/stop");
const createMarket = require("./resources/sources/create/market");
const createLimit = require("./resources/sources/create/limit");

const { ASSET, APIKEY, APISECRET } = process.env;

const server = express();
const binance = new Binance().options({
	APIKEY,
	APISECRET,
});

server.use(express.json());

server.post("/", async (request, response) => {
	const context = await fetch({ request, asset: ASSET, binance });
	const { type, side, ticker, quantity } = context;

	console.info("Algorithmic trading has been started;");
	console.info(type, side, ticker, quantity);

	if (type === "STOP") {
		response.send(await createStop(context));
	} else if (type === "MARKET") {
		response.send(await createMarket(context));
	} else {
		response.send(await createLimit(context));
	}
});

server.listen(process.env.PORT || 3000);
