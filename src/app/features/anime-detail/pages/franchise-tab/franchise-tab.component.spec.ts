import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranchiseTabComponent } from './franchise-tab.component';

describe('FranchiseTabComponent', () => {
  let component: FranchiseTabComponent;
  let fixture: ComponentFixture<FranchiseTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FranchiseTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FranchiseTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
