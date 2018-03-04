import { Component, ViewChild } from '@angular/core';

import { Strategies } from '../strategies';
import { BinanceService } from '../../binance-api/binance.service';
import { BinanceIntervals } from '../../binance-api/binance-intervals';
import { MacdstrategyComponent } from './paper-trade-strategies-parameters/macdstrategy.component';
import { EmaStrategyComponent } from './paper-trade-strategies-parameters/ema-strategy.component';
import { RsiStrategyComponent } from './paper-trade-strategies-parameters/rsi-strategy.component';

@Component({
    selector: 'app-paper-trade-parameters',
    templateUrl: './paper-trade-parameters.component.html',
    styleUrls: ['./paper-trade-parameters.component.css']
})
export class PaperTradeParametersComponent {
    @ViewChild('macdStrategyComponent') macdStrategyComponent: MacdstrategyComponent;

    @ViewChild('emaStrategyComponent') emaStrategyComponent: EmaStrategyComponent;

    @ViewChild('rsiStrategyComponent') rsiStrategyComponent: RsiStrategyComponent;

    private strategies: string[];
    private pairs: string[];
    private intervals: string[];

    private _selectedPair: string;
    private _selectedInterval: string;
    private _selectedStrategy: string;
    private _volumeValidation: boolean;
    private _volumeValidationRatio: number;

    constructor(binanceService: BinanceService) {
        this.strategies = new Array();
        this.pairs = new Array();
        this.intervals = new Array();

        for (let strategyStr in Strategies) {
            this.strategies.push(strategyStr.toString());
        }

        for (let intervalStr in BinanceIntervals) {
            this.intervals.push(BinanceIntervals[intervalStr.toString()]);
        }

        binanceService.getPairs().subscribe(res => {
            this.pairs = res;
            this.pairs.sort();
        });
    }

    get selectedPair() {
        return this._selectedPair;
    }

    get selectedInterval() {
        return this._selectedInterval;
    }

    get selectedStrategy() {
        return this._selectedStrategy;
    }

    get volumeValidation() {
        return this._volumeValidation;
    }

    get volumeValidationRatio() {
        return this._volumeValidationRatio;
    }
}
