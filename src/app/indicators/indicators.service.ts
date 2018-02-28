import { Injectable } from '@angular/core';

@Injectable()
export class IndicatorsService {

    constructor() { }

    computeSMA(nbPeriods: number, candlesticks: number[]) {
        let sma: number[] = [];

        for (let i = 0; i < candlesticks.length; i++) {
            sma[i] = 0;
        }

        for (let i = nbPeriods - 1; i < candlesticks.length; i++) {
            let currentSMA = 0.0;
            for (let j = i; j > i - nbPeriods; j--) {
                currentSMA += Number(candlesticks[j]);
            }

            currentSMA /= nbPeriods;

            sma[i] = currentSMA;
        }

        return sma;
    }

    computeEMA(nbPeriods: number, candlesticks: number[]) {
        let ema: number[] = [];

        for (let i = 0; i < candlesticks.length; i++) {
            ema[i] = 0;
        }

        let multiplier = (2.0 / (nbPeriods + 1.0));

        for (let i = nbPeriods - 1; i < candlesticks.length; i++) {
            let currentEma = 0.0;

            if (i == nbPeriods - 1) {
                for (let j = i; j > i - nbPeriods; j--) {
                    currentEma += candlesticks[j];
                }

                currentEma /= nbPeriods;
            }
            else {
                currentEma = (candlesticks[i] - ema[i - 1]) * multiplier + ema[i - 1];
            }
            ema[i] = currentEma;
        }

        return ema;
    }

    computeMACD(fastEma: number[], slowEma: number[]) {
        let macd: number[] = [];

        for (let i = 0; i < slowEma.length; i++) {
            macd[i] = 0;
        }

        let start = 0;
        for (let i = 0; i < fastEma.length; i++) {
            if (fastEma[i] != 0) {
                start = i;
                break;
            }
        }

        for (let i = start; i < slowEma.length; i++) {
            macd[i] = fastEma[i + (fastEma.length - slowEma.length)] - slowEma[i];
        }

        return macd;
    }
}
