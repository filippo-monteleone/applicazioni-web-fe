import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-place-car-park',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './place-car-park.component.html',
  styleUrl: './place-car-park.component.css',
})
export class PlaceCarParkComponent {
  expand: boolean = true;
}
