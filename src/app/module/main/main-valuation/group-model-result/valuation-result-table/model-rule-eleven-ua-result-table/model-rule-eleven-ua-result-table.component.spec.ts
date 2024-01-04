import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelRuleElevenUaResultTableComponent } from './model-rule-eleven-ua-result-table.component';

describe('ModelRuleElevenUaResultTableComponent', () => {
  let component: ModelRuleElevenUaResultTableComponent;
  let fixture: ComponentFixture<ModelRuleElevenUaResultTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModelRuleElevenUaResultTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelRuleElevenUaResultTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
