import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FcffDetailsComponent } from './fcff-details.component';

describe('FcffDetailsComponent', () => {
  let component: FcffDetailsComponent;
  let fixture: ComponentFixture<FcffDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FcffDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FcffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
