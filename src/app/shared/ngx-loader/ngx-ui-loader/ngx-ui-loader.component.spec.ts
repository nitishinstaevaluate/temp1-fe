import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxUiLoaderComponent } from './ngx-ui-loader.component';

describe('NgxUiLoaderComponent', () => {
  let component: NgxUiLoaderComponent;
  let fixture: ComponentFixture<NgxUiLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxUiLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxUiLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
