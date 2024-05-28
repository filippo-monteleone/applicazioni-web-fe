import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-car-park',
  standalone: true,
  imports: [],
  templateUrl: './new-car-park.component.html',
  styleUrl: './new-car-park.component.css',
})
export class NewCarParkComponent {
  lat: number = 0;
  lng: number = 0;
  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.lat = Number(params['lat']);
      this.lng = Number(params['lng']);
    });
  }

  ngOnInit() {
    console.log(this.lat, this.lng);
  }
}
