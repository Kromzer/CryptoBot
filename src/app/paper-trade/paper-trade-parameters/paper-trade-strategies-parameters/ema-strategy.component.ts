import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ema-strategy',
    templateUrl: './ema-strategy.component.html',
    styleUrls: ['./ema-strategy.component.css']
})
export class EmaStrategyComponent implements OnInit {

    private _fastEmaLength: number;
    private _slowEmaLength: number;

    constructor() { }

    ngOnInit() {
    }

    get fastEmaLength() {
        return this._fastEmaLength;
    }

    get slowEmaLength() {
        return this._slowEmaLength;
    }
}
