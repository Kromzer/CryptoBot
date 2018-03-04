import { Component, ViewChild } from '@angular/core';

import 'rxjs/add/operator/map'
import { BinanceService } from './binance-api/binance.service';
import { PaperTradeParametersComponent } from './paper-trade/paper-trade-parameters/paper-trade-parameters.component';
import { PaperTradeGraphDirective } from './paper-trade/paper-trade-graph/paper-trade-graph.directive';
import { IndicatorsService } from './indicators/indicators.service';
import { PaperTradeResultsComponent } from './paper-trade/paper-trade-results/paper-trade-results.component';
import { Strategies } from './paper-trade/strategies';
import { BinanceCandlestick } from './binance-api/binance-candlestick';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    @ViewChild('paperTradeParameters') paperTradeParametersComponent: PaperTradeParametersComponent;
    @ViewChild('paperTradeGraph') paperTradeGraph: PaperTradeGraphDirective;
    @ViewChild('paperTradeResults') paperTradeResultsComponent: PaperTradeResultsComponent;
    title = 'app';

    binanceService: BinanceService;
    indicatorsService: IndicatorsService;

    constructor(binanceService: BinanceService, indicatorService: IndicatorsService) {
        this.binanceService = binanceService;
        this.indicatorsService = indicatorService;
    }

    doPaperTrade() {
        this.binanceService.getCandlesticks(this.paperTradeParametersComponent.selectedPair, this.paperTradeParametersComponent.selectedInterval).subscribe(result => {
            if (this.paperTradeParametersComponent.selectedStrategy == Strategies.MACD) {
                this.macdStrategy(result);
            }
            else if (this.paperTradeParametersComponent.selectedStrategy == Strategies.EMA) {
                this.emaStrategy(result);
            }
            else if (this.paperTradeParametersComponent.selectedStrategy == Strategies.RSI) {
                this.rsiStrategy(result);
            }
        });
    }

    macdStrategy(result: any) {
        let closePrices: number[] = [];
        let volumes: number[] = [];
        result.forEach(function (data) {
            closePrices.push(data.closePrice);
            volumes.push(data.volume);
        });

        let ema12 = this.indicatorsService.computeEMA(12, closePrices);
        let ema26 = this.indicatorsService.computeEMA(26, closePrices);

        let volumeSMA = this.indicatorsService.computeSMA(10, volumes);
        let volumeValidation = this.paperTradeParametersComponent.volumeValidation;
        let volumeValidationRatio = this.paperTradeParametersComponent.volumeValidationRatio;

        let macd = this.indicatorsService.computeMACD(ema12, ema26);
        let signal = this.indicatorsService.computeEMA(9, macd);

        let bought: boolean = false;

        let buyDates: number[] = [];
        let sellDates: number[] = [];

        let buyPrice: number = 0;
        let gains: number = 0;
        let buyQuantity: number = 0;

        let currencyPerTrade = 0.01;

        let penetrationRatio = Number(this.paperTradeParametersComponent.macdStrategyComponent.penetrationRatio);

        for (let i = 36; i + 1 < ema12.length; i++) {
            if (macd[i] < (signal[i] * penetrationRatio) && bought == true) {
                if (!volumeValidation || (volumeValidation && result[i].volume > volumeSMA[i] * volumeValidationRatio)) {
                    bought = false;
                    sellDates.push(result[i + 1].openTime);
                    gains += (result[i + 1].openPrice - buyPrice) * buyQuantity;
                }
            }
            else if (macd[i] > (signal[i] * penetrationRatio) && bought == false) {
                if (!volumeValidation || (volumeValidation && result[i].volume > volumeSMA[i] * volumeValidationRatio)) {
                    bought = true;
                    buyDates.push(result[i + 1].openTime);
                    buyPrice = result[i + 1].openPrice;
                    buyQuantity = currencyPerTrade / buyPrice;
                }
            }
        }

        this.paperTradeGraph.displayPaperTradeGraph(result, buyDates, sellDates);
        this.paperTradeResultsComponent.gains = gains;
        this.paperTradeResultsComponent.duration = result[result.length - 1].closeTime - result[0].closeTime;
    }

    emaStrategy(result: any) {
        let closePrices: number[] = [];
        let volumes: number[] = [];
        result.forEach(function (data) {
            closePrices.push(data.closePrice);
            volumes.push(data.volume);
        });

        let fastEMA = this.indicatorsService.computeEMA(Number(this.paperTradeParametersComponent.emaStrategyComponent.fastEmaLength), closePrices);
        let slowEMA = this.indicatorsService.computeEMA(Number(this.paperTradeParametersComponent.emaStrategyComponent.slowEmaLength), closePrices);

        let volumeSMA = this.indicatorsService.computeSMA(10, volumes);
        let volumeValidation = this.paperTradeParametersComponent.volumeValidation;
        let volumeValidationRatio = this.paperTradeParametersComponent.volumeValidationRatio;

        let bought: boolean = false;

        let buyDates: number[] = [];
        let sellDates: number[] = [];

        let buyPrice: number = 0;
        let gains: number = 0;
        let buyQuantity: number = 0;

        let currencyPerTrade = 0.01;

        for (let i = Number(this.paperTradeParametersComponent.emaStrategyComponent.slowEmaLength) + 1; i < fastEMA.length; i++) {
            if ((fastEMA[i] < slowEMA[i]) && bought == true) {
                if (!volumeValidation || (volumeValidation && result[i].volume > volumeSMA[i] * volumeValidationRatio)) {
                    bought = false;
                    sellDates.push(result[i + 1].openTime);
                    gains += (result[i + 1].openPrice - buyPrice) * buyQuantity;
                }
            }
            else if ((fastEMA[i] > slowEMA[i]) && bought == false) {
                if (!volumeValidation || (volumeValidation && result[i].volume > volumeSMA[i] * volumeValidationRatio)) {
                    bought = true;
                    buyDates.push(result[i + 1].openTime);
                    buyPrice = result[i + 1].openPrice;
                    buyQuantity = currencyPerTrade / buyPrice;
                }
            }
        }

        this.paperTradeGraph.displayPaperTradeGraph(result, buyDates, sellDates);
        this.paperTradeResultsComponent.gains = gains;
        this.paperTradeResultsComponent.duration = result[result.length - 1].closeTime - result[0].closeTime;
    }

    rsiStrategy(result: any) {
        let closePrices: number[] = [];
        let volumes: number[] = [];
        result.forEach(function (data) {
            closePrices.push(data.closePrice);
            volumes.push(data.volume);
        });

        let oversoldRatio = this.paperTradeParametersComponent.rsiStrategyComponent.oversoldRatio;
        let overboughtRatio = this.paperTradeParametersComponent.rsiStrategyComponent.overbougtRatio;
        let length = this.paperTradeParametersComponent.rsiStrategyComponent.length;
        let volumeSMA = this.indicatorsService.computeSMA(10, volumes);
        let volumeValidation = this.paperTradeParametersComponent.volumeValidation;
        let volumeValidationRatio = this.paperTradeParametersComponent.volumeValidationRatio;
        console.log(typeof length);
        let rsi = this.indicatorsService.computeRSI(result, length);

        let bought: boolean = false;

        let buyDates: number[] = [];
        let sellDates: number[] = [];

        let buyPrice: number = 0;
        let gains: number = 0;
        let buyQuantity: number = 0;

        let currencyPerTrade = 0.01;

        console.log(rsi);

        for (let i = 15; i < rsi.length; i++) {
            if ((rsi[i] > overboughtRatio) && bought == true) {
                if (!volumeValidation || (volumeValidation && result[i].volume > volumeSMA[i] * volumeValidationRatio)) {
                    bought = false;
                    sellDates.push(result[i + 1].openTime);
                    gains += (result[i + 1].openPrice - buyPrice) * buyQuantity;
                }
            }
            else if ((rsi[i] < oversoldRatio) && bought == false) {
                if (!volumeValidation || (volumeValidation && result[i].volume > volumeSMA[i] * volumeValidationRatio)) {
                    bought = true;
                    buyDates.push(result[i + 1].openTime);
                    buyPrice = result[i + 1].openPrice;
                    buyQuantity = currencyPerTrade / buyPrice;
                }
            }
        }

        this.paperTradeGraph.displayPaperTradeGraph(result, buyDates, sellDates);
        this.paperTradeResultsComponent.gains = gains;
        this.paperTradeResultsComponent.duration = result[result.length - 1].closeTime - result[0].closeTime;
    }
}
