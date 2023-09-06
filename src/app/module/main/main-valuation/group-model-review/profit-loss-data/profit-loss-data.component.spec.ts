import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfitLossDataComponent } from './profit-loss-data.component';

describe('ProfitLossDataComponent', () => {
  let component: ProfitLossDataComponent;
  let fixture: ComponentFixture<ProfitLossDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfitLossDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfitLossDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
