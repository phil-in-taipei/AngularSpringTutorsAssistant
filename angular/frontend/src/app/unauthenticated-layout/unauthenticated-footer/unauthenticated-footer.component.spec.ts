import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthenticatedFooterComponent } from './unauthenticated-footer.component';

describe('UnauthenticatedFooterComponent', () => {
  let component: UnauthenticatedFooterComponent;
  let fixture: ComponentFixture<UnauthenticatedFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnauthenticatedFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnauthenticatedFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
