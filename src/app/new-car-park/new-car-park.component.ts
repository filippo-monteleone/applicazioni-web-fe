import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-new-car-park',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatIcon],
  templateUrl: './new-car-park.component.html',
  styleUrl: './new-car-park.component.css',
})
export class NewCarParkComponent {
  lat: number = 0;
  lng: number = 0;

  constructor(private route: ActivatedRoute, private _location: Location) {
    this.route.queryParams.subscribe((params) => {
      this.lat = Number(params['lat']);
      this.lng = Number(params['lng']);
    });
  }

  ngOnInit() {
    console.log(this.lat, this.lng);
  }

  back() {
    this._location.back();
  }
}
