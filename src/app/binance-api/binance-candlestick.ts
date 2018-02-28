export class BinanceCandlestick {
    //Timestamp of opening time
    private _openTime: number;

    //Open price
    private _openPrice: number;

    //High price
    private _highPrice: number;

    //Low price
    private _lowPrice: number;

    //Close price
    private _closePrice: number;

    //Volume
    private _volume: number;

    //Timestamp of close time
    private _closeTime: number;

    constructor(openTime, openPrice, highPrice, lowPrice, closePrice, volume, closeTime) {
        this._openTime = openTime;
        this._openPrice = Number(openPrice);
        this._highPrice = Number(highPrice);
        this._lowPrice = Number(lowPrice);
        this._closePrice = Number(closePrice);
        this._volume = Number(volume);
        this._closeTime = closeTime;
    }

    get openTime() {
        return this._openTime;
    }

    get openPrice() {
        return this._openPrice;
    }

    get highPrice() {
        return this._highPrice;
    }

    get lowPrice() {
        return this._lowPrice;
    }

    get closePrice() {
        return this._closePrice;
    }

    get volume() {
        return this._volume;
    }

    get closeTime() {
        return this._closeTime;
    }
}
