import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rsi-strategy',
    templateUrl: './rsi-strategy.component.html',
    styleUrls: ['./rsi-strategy.component.css']
})
export class RsiStrategyComponent implements OnInit {

    private _oversoldRatio: number = 30;
    private _overboughtRatio: number = 70;
    private _length: number = 14;

    constructor() { }

    ngOnInit() {
    }

    get oversoldRatio() {
        return this._oversoldRatio;
    }

    get overbougtRatio() {
        return this._overboughtRatio;
    }

    set length(length) {
        this._length = Number(length);
    }
    get length() {
        return this._length;
    }
}
