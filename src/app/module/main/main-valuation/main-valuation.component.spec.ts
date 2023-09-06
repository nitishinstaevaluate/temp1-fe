import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainValuationComponent } from './main-valuation.component';

describe('MainValuationComponent', () => {
  let component: MainValuationComponent;
  let fixture: ComponentFixture<MainValuationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainValuationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainValuationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
