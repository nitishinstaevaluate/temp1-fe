import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeValuationDetailsComponent } from './relative-valuation-details.component';

describe('RelativeValuationDetailsComponent', () => {
  let component: RelativeValuationDetailsComponent;
  let fixture: ComponentFixture<RelativeValuationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelativeValuationDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelativeValuationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
