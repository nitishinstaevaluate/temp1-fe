import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModelResultComponent } from './group-model-result.component';

describe('GroupModelResultComponent', () => {
  let component: GroupModelResultComponent;
  let fixture: ComponentFixture<GroupModelResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupModelResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupModelResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
