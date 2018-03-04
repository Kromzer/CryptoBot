import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RsiStrategyComponent } from './rsi-strategy.component';

describe('RsiStrategyComponent', () => {
  let component: RsiStrategyComponent;
  let fixture: ComponentFixture<RsiStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RsiStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RsiStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
