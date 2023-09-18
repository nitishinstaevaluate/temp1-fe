import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcfeDetailsComponent } from './fcfe-details.component';

describe('FcfeDetailsComponent', () => {
  let component: FcfeDetailsComponent;
  let fixture: ComponentFixture<FcfeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FcfeDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcfeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
