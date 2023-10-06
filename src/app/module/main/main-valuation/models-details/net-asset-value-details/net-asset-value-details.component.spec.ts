import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetAssetValueDetailsComponent } from './net-asset-value-details.component';

describe('NetAssetValueDetailsComponent', () => {
  let component: NetAssetValueDetailsComponent;
  let fixture: ComponentFixture<NetAssetValueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetAssetValueDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetAssetValueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
