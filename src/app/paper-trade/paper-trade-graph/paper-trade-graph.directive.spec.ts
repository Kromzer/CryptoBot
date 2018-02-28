import { PaperTradeGraphDirective } from './paper-trade-graph.directive';
import { ElementRef } from '@angular/core';
import { BinanceService } from '../../binance-api/binance.service';
import { IndicatorsService } from '../../indicators/indicators.service';

describe('PaperTradeGraphDirective', () => {
  it('should create an instance', () => {
    const directive = PaperTradeGraphDirective;
    expect(directive).toBeTruthy();
  });
});
