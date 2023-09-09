import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericModalBoxComponent } from './generic-modal-box.component';

describe('GenericModalBoxComponent', () => {
  let component: GenericModalBoxComponent;
  let fixture: ComponentFixture<GenericModalBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericModalBoxComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericModalBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
