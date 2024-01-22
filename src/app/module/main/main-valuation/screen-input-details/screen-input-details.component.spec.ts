import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenInputDetailsComponent } from './screen-input-details.component';

describe('ScreenInputDetailsComponent', () => {
  let component: ScreenInputDetailsComponent;
  let fixture: ComponentFixture<ScreenInputDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreenInputDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScreenInputDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
