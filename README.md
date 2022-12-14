# API examples

#### OPEN LIMIT

```json
{
	"type": "OPEN",
	"side": "BUY",
	"ticker": "ETHUSDT",
	"risk": "5",
	"price": "1100",
	"scopes": {
		"stop": "1000", 
		"profit": "1200"
	}
}
```

#### OPEN MARKET

```json
{
	"type": "OPEN",
	"side": "BUY",
	"ticker": "ETHUSDT",
	"risk": "5",
	"scopes": {
		"stop": "1000", 
		"profit": "1200"
	}
}
```

#### CLOSE MARKET

```json
{
	"type": "CLOSE", 
	"ticker": "ETHUSDT",
	"amount": "25"
}
```

#### STOP_MARKET

```json
{
	"type": "STOP_MARKET", 
	"side": "SELL", 
	"ticker": "ETHUSDT", 
	"amount": "100",
	"price": "900"
}
```

#### TAKE_PROFIT_MARKET

```json
{
	"type": "TAKE_PROFIT_MARKET",
	"side": "SELL",
	"ticker": "ETHUSDT",
	"amount": "50",
	"price": "1300"
}
```
