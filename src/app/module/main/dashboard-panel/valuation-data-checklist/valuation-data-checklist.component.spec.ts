import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationDataChecklistComponent } from './valuation-data-checklist.component';

describe('ValuationDataChecklistComponent', () => {
  let component: ValuationDataChecklistComponent;
  let fixture: ComponentFixture<ValuationDataChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuationDataChecklistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValuationDataChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
