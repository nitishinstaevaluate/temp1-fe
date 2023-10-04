import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparableIndustriesDetailsComponent } from './comparable-industries-details.component';

describe('ComparableIndustriesDetailsComponent', () => {
  let component: ComparableIndustriesDetailsComponent;
  let fixture: ComponentFixture<ComparableIndustriesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComparableIndustriesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComparableIndustriesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
