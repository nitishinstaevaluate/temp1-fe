import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModelControlsComponent } from './group-model-controls.component';

describe('GroupModelControlsComponent', () => {
  let component: GroupModelControlsComponent;
  let fixture: ComponentFixture<GroupModelControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupModelControlsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupModelControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
