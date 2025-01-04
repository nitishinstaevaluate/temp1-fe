import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostToDuplicateDetailsComponent } from './cost-to-duplicate-details.component';

describe('CostToDuplicateDetailsComponent', () => {
  let component: CostToDuplicateDetailsComponent;
  let fixture: ComponentFixture<CostToDuplicateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostToDuplicateDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostToDuplicateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
