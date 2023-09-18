import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationResultTableComponent } from './valuation-result-table.component';

describe('ValuationResultTableComponent', () => {
  let component: ValuationResultTableComponent;
  let fixture: ComponentFixture<ValuationResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuationResultTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuationResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
