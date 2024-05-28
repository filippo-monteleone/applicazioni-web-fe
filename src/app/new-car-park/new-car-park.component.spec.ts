import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCarParkComponent } from './new-car-park.component';

describe('NewCarParkComponent', () => {
  let component: NewCarParkComponent;
  let fixture: ComponentFixture<NewCarParkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCarParkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewCarParkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
