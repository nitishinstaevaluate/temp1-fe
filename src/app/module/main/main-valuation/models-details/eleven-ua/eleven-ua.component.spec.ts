import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevenUAComponent } from './eleven-ua.component';

describe('ElevenUAComponent', () => {
  let component: ElevenUAComponent;
  let fixture: ComponentFixture<ElevenUAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElevenUAComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevenUAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
