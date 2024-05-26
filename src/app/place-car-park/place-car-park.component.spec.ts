import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceCarParkComponent } from './place-car-park.component';

describe('PlaceCarParkComponent', () => {
  let component: PlaceCarParkComponent;
  let fixture: ComponentFixture<PlaceCarParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceCarParkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceCarParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
