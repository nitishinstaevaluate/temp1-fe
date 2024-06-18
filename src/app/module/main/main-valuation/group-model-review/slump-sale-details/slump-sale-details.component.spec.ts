import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlumpSaleDetailsComponent } from './slump-sale-details.component';

describe('SlumpSaleDetailsComponent', () => {
  let component: SlumpSaleDetailsComponent;
  let fixture: ComponentFixture<SlumpSaleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlumpSaleDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlumpSaleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
