import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperTradeParametersComponent } from './paper-trade-parameters.component';

describe('PaperTradeParametersComponent', () => {
  let component: PaperTradeParametersComponent;
  let fixture: ComponentFixture<PaperTradeParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperTradeParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperTradeParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
