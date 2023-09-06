import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupModelReviewComponent } from './group-model-review.component';

describe('GroupModelReviewComponent', () => {
  let component: GroupModelReviewComponent;
  let fixture: ComponentFixture<GroupModelReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupModelReviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroupModelReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
