import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitosComponent } from './debitos.component';

describe('DebitosComponent', () => {
  let component: DebitosComponent;
  let fixture: ComponentFixture<DebitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
