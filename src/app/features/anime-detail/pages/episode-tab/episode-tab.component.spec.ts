import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeTabComponent } from './episode-tab.component';

describe('EpisodeTabComponent', () => {
  let component: EpisodeTabComponent;
  let fixture: ComponentFixture<EpisodeTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EpisodeTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
