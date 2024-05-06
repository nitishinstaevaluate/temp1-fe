import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelMarketPriceResultTableComponent } from './model-market-price-result-table.component';

describe('ModelMarketPriceResultTableComponent', () => {
  let component: ModelMarketPriceResultTableComponent;
  let fixture: ComponentFixture<ModelMarketPriceResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelMarketPriceResultTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelMarketPriceResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
