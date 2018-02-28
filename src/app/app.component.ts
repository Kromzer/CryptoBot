import { Component, ViewChild } from '@angular/core';

import 'rxjs/add/operator/map'
import { BinanceService } from './binance-api/binance.service';
import { PaperTradeParametersComponent } from './paper-trade/paper-trade-parameters/paper-trade-parameters.component';
import { PaperTradeGraphDirective } from './paper-trade/paper-trade-graph/paper-trade-graph.directive';
import { IndicatorsService } from './indicators/indicators.service';
import { PaperTradeResultsComponent } from './paper-trade/paper-trade-results/paper-trade-results.component';

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

            for (let i = 36; i + 1 < ema12.length; i++) {
                if (macd[i] < signal[i] && bought == true) {
                    bought = false;
                    sellDates.push(result[i + 1].openTime);
                    gains += result[i + 1].openPrice - buyPrice;
                }
                else if (macd[i] > signal[i] && bought == false) {
                    bought = true;
                    buyDates.push(result[i + 1].openTime);
                    buyPrice = result[i + 1].openPrice;
                }
            }

            this.paperTradeGraph.displayPaperTradeGraph(result, buyDates, sellDates);
            this.paperTradeResultsComponent.gains = gains;
            this.paperTradeResultsComponent.duration = result[result.length - 1].closeTime - result[0].closeTime;
        });
    }
}
