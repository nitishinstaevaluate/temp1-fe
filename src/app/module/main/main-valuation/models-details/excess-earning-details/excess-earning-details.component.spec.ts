import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcessEarningDetailsComponent } from './excess-earning-details.component';

describe('ExcessEarningDetailsComponent', () => {
  let component: ExcessEarningDetailsComponent;
  let fixture: ComponentFixture<ExcessEarningDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExcessEarningDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExcessEarningDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
