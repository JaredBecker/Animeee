import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterTabComponent } from './character-tab.component';

describe('CharacterTabComponent', () => {
  let component: CharacterTabComponent;
  let fixture: ComponentFixture<CharacterTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
