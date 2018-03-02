import { Component, ViewChild } from '@angular/core';

import 'rxjs/add/operator/map'
import { BinanceService } from './binance-api/binance.service';
import { PaperTradeParametersComponent } from './paper-trade/paper-trade-parameters/paper-trade-parameters.component';
import { PaperTradeGraphDirective } from './paper-trade/paper-trade-graph/paper-trade-graph.directive';
import { IndicatorsService } from './indicators/indicators.service';
import { PaperTradeResultsComponent } from './paper-trade/paper-trade-results/paper-trade-results.component';
import { Strategies } from './paper-trade/strategies';

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
        });
    }

    macdStrategy(result: any) {
        let closePrices: number[] = [];
        result.forEach(function (data) {
            closePrices.push(data.closePrice);
        });

        let ema12 = this.indicatorsService.computeEMA(12, closePrices);
        let ema26 = this.indicatorsService.computeEMA(26, closePrices);

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
                bought = false;
                sellDates.push(result[i + 1].openTime);
                gains += (result[i + 1].openPrice - buyPrice) * buyQuantity;
            }
            else if (macd[i] > (signal[i] * penetrationRatio) && bought == false) {
                bought = true;
                buyDates.push(result[i + 1].openTime);
                buyPrice = result[i + 1].openPrice;
                buyQuantity = currencyPerTrade / buyPrice;
            }
        }

        this.paperTradeGraph.displayPaperTradeGraph(result, buyDates, sellDates);
        this.paperTradeResultsComponent.gains = gains;
        this.paperTradeResultsComponent.duration = result[result.length - 1].closeTime - result[0].closeTime;
    }

    emaStrategy(result: any) {
        let closePrices: number[] = [];
        result.forEach(function (data) {
            closePrices.push(data.closePrice);
        });

        let fastEMA = this.indicatorsService.computeEMA(5, closePrices);
        let slowEMA = this.indicatorsService.computeEMA(10, closePrices);

        let bought: boolean = false;

        let buyDates: number[] = [];
        let sellDates: number[] = [];

        let buyPrice: number = 0;
        let gains: number = 0;
        let buyQuantity: number = 0;

        let currencyPerTrade = 0.01;

        for (let i = 26 + 1; i < fastEMA.length; i++) {
            if ((fastEMA[i] < slowEMA[i]) && bought == true) {
                bought = false;
                sellDates.push(result[i + 1].openTime);
                gains += (result[i + 1].openPrice - buyPrice) * buyQuantity;
            }
            else if ((fastEMA[i] > slowEMA[i]) && bought == false) {
                bought = true;
                buyDates.push(result[i + 1].openTime);
                buyPrice = result[i + 1].openPrice;
                buyQuantity = currencyPerTrade / buyPrice;
            }
        }

        this.paperTradeGraph.displayPaperTradeGraph(result, buyDates, sellDates);
        this.paperTradeResultsComponent.gains = gains;
        this.paperTradeResultsComponent.duration = result[result.length - 1].closeTime - result[0].closeTime;
    }
}
