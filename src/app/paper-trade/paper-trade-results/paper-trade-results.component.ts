import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-paper-trade-results',
    templateUrl: './paper-trade-results.component.html',
    styleUrls: ['./paper-trade-results.component.css']
})
export class PaperTradeResultsComponent implements OnInit {

    private _gains: number;
    private _duration: number;

    private _dayDuration: number;

    private _dayGains: number;

    constructor() { }

    ngOnInit() {
    }

    get gains() {
        return this._gains;

    }

    set gains(gains: number) {
        this._gains = gains;

        this.dayGains = this.gains / this.dayDuration;
    }

    get duration() {
        return this._duration;
    }

    set duration(duration: number) {
        this._duration = duration;

        this.dayDuration = duration / 1000 / 60 / 60 / 24;
    }

    get dayDuration() {
        return this._dayDuration;
    }

    set dayDuration(dayDuration: number) {
        this._dayDuration = dayDuration;

        this.dayGains = this.gains / this.dayDuration;
    }

    get dayGains() {
        return this._dayGains;
    }

    set dayGains(dayGains: number) {
        this._dayGains = dayGains;
    }
}
