import { Injectable } from '@angular/core';
import { BinanceCandlestick } from '../binance-api/binance-candlestick';

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

    computeRSI(candlesticks: BinanceCandlestick[], length: number) {
        let gains: number[] = new Array();
        let losses: number[] = new Array();

        let averageGain: number[] = new Array();
        let averageLoss: number[] = new Array();

        let firstAverageGain: number = 0;
        let firstAverageLoss: number = 0;

        let rs: number[] = new Array();
        let rsi: number[] = new Array();

        gains.push(0);
        losses.push(0)
        rs.push(0);
        rsi.push(0);

        for (let i = 1; i < candlesticks.length; i++) {
            if (candlesticks[i].closePrice > candlesticks[i - 1].closePrice) {
                gains.push(candlesticks[i].closePrice - candlesticks[i - 1].closePrice);
                losses.push(0);
            }
            else if (candlesticks[i].closePrice < candlesticks[i - 1].closePrice) {
                gains.push(0);
                losses.push(-(candlesticks[i].closePrice - candlesticks[i - 1].closePrice));
            }
            else {
                gains.push(0);
                losses.push(0);
            }

            rs.push(0);
            rsi.push(0);
        }

        for (let i = 0; i < length; i++) {
            averageGain.push(0);
            averageLoss.push(0);

            firstAverageGain += gains[i];
            firstAverageLoss += losses[i];
        }

        firstAverageGain /= length;
        firstAverageLoss /= length;

        averageGain.push(firstAverageGain);
        averageLoss.push(firstAverageLoss);

        rs[length] = firstAverageGain / firstAverageLoss;
        rsi[length] = 100 - (100 / (1 + rs[length]));
        for (let i = length + 1; i < candlesticks.length; i++) {
            let delta = candlesticks[i].closePrice - candlesticks[i - 1].closePrice;
            if (delta > 0) {
                averageGain.push((averageGain[i - 1] * (length - 1) + delta) / length);
                averageLoss.push(averageLoss[i - 1] * (length - 1) / length);
            }
            else {
                averageGain.push(averageGain[i - 1] * (length - 1) / length);
                averageLoss.push((averageLoss[i - 1] * (length - 1) - delta) / length);
            }

            rs[i] = averageGain[i] / averageLoss[i];
            rsi[i] = 100 - (100 / (1 + rs[i]));
        }
        return rsi;
    }
}
