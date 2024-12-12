import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlumpSaleComponent } from './slump-sale.component';

describe('SlumpSaleComponent', () => {
  let component: SlumpSaleComponent;
  let fixture: ComponentFixture<SlumpSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlumpSaleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlumpSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
