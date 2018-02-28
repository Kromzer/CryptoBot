import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperTradeResultsComponent } from './paper-trade-results.component';

describe('PaperTradeResultsComponent', () => {
    let component: PaperTradeResultsComponent;
    let fixture: ComponentFixture<PaperTradeResultsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PaperTradeResultsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaperTradeResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
