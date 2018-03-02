import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MacdstrategyComponent } from './macdstrategy.component';

describe('MacdstrategyComponent', () => {
  let component: MacdstrategyComponent;
  let fixture: ComponentFixture<MacdstrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MacdstrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MacdstrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
