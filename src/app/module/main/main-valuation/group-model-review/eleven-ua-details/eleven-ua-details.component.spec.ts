import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevenUaDetailsComponent } from './eleven-ua-details.component';

describe('ElevenUaDetailsComponent', () => {
  let component: ElevenUaDetailsComponent;
  let fixture: ComponentFixture<ElevenUaDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElevenUaDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElevenUaDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
