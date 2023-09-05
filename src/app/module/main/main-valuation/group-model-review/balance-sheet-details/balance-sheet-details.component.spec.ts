import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceSheetDetailsComponent } from './balance-sheet-details.component';

describe('BalanceSheetDetailsComponent', () => {
  let component: BalanceSheetDetailsComponent;
  let fixture: ComponentFixture<BalanceSheetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceSheetDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BalanceSheetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
