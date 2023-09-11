import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelativeValuationsTableComponent } from './relative-valuations-table.component';

describe('RelativeValuationsTableComponent', () => {
  let component: RelativeValuationsTableComponent;
  let fixture: ComponentFixture<RelativeValuationsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelativeValuationsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelativeValuationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
