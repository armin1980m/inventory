import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalereportComponent } from './salereport.component';

describe('SalereportComponent', () => {
  let component: SalereportComponent;
  let fixture: ComponentFixture<SalereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
