import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualproductComponent } from './manualproduct.component';

describe('ManualproductComponent', () => {
  let component: ManualproductComponent;
  let fixture: ComponentFixture<ManualproductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualproductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
