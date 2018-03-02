import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { BinanceService } from './binance-api/binance.service';
import { IndicatorsService } from './indicators/indicators.service';
import { PaperTradeParametersComponent } from './paper-trade/paper-trade-parameters/paper-trade-parameters.component';
import { PaperTradeGraphDirective } from './paper-trade/paper-trade-graph/paper-trade-graph.directive';
import { PaperTradeResultsComponent } from './paper-trade/paper-trade-results/paper-trade-results.component';
import { MacdstrategyComponent } from './paper-trade/paper-trade-parameters/paper-trade-strategies-parameters/macdstrategy.component';


@NgModule({
    declarations: [
        AppComponent,
        PaperTradeGraphDirective,
        PaperTradeParametersComponent,
        PaperTradeResultsComponent,
        MacdstrategyComponent
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule
    ],
    providers: [BinanceService, IndicatorsService],
    bootstrap: [AppComponent]
})
export class AppModule { }
