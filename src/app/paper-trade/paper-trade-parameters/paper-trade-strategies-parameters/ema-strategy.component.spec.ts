import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmaStrategyComponent } from './ema-strategy.component';

describe('EmaStrategyComponent', () => {
  let component: EmaStrategyComponent;
  let fixture: ComponentFixture<EmaStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmaStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmaStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
