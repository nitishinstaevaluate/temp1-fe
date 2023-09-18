import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelRelativeValuationResultTableComponent } from './model-relative-valuation-result-table.component';

describe('ModelRelativeValuationResultTableComponent', () => {
  let component: ModelRelativeValuationResultTableComponent;
  let fixture: ComponentFixture<ModelRelativeValuationResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelRelativeValuationResultTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelRelativeValuationResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
