import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { BinanceCandlestick } from './binance-candlestick';

@Injectable()
export class BinanceService {

    constructor(private http: Http) {

    }

    getCandlesticks(symbol: string, interval: string) {
        return this.http.get('/api/v1/klines?symbol=' + symbol + '&interval=' + interval).map((res: Response) => {
            let candlesticks = [];
            res.json().forEach(function (value) {
                let candlestick = new BinanceCandlestick(value[0], value[1], value[2], value[3], value[4], value[5], value[6]);

                candlesticks.push(candlestick);
            });
            return candlesticks;
        });
    }

    getPairs() {
        let pairs = new Array();
        return this.http.get('/api/v1/exchangeInfo').map((res: Response) => {
            let result = res.json();
            for (let symbol of result['symbols']) {
                pairs.push(symbol['symbol']);
            }

            return pairs;
        });
    }
}
