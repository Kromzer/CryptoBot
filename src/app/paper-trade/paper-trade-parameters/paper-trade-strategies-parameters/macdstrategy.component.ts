import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-macdstrategy',
    templateUrl: './macdstrategy.component.html',
    styleUrls: ['./macdstrategy.component.css']
})
export class MacdstrategyComponent implements OnInit {

    private _penetrationRatio: number = 1;
    constructor() { }

    ngOnInit() {
    }

    get penetrationRatio() {
        return this._penetrationRatio;
    }

}
