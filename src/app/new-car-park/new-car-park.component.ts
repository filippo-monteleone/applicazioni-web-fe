import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-car-park',
  standalone: true,
  imports: [MatButtonModule, MatInputModule, MatIcon, ReactiveFormsModule],
  templateUrl: './new-car-park.component.html',
  styleUrl: './new-car-park.component.css',
})
export class NewCarParkComponent {
  lat: number = 0;
  lng: number = 0;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private _location: Location,
    public http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.route.queryParams.subscribe((params) => {
      this.lat = Number(params['lat']);
      this.lng = Number(params['lng']);
    });
  }

  parkForm = new FormGroup({
    name: new FormControl<string>(''),
    parkSpots: new FormControl<string>(''),
    parkRate: new FormControl<string>(''),
    chargeRate: new FormControl<string>(''),
    power: new FormControl<string>(''),
  });

  onSubmit() {
    const name = this.parkForm.get('name')?.value;
    const carSpots = this.parkForm.get('parkSpots')?.value;
    const parkRate = this.parkForm.get('parkRate')?.value;
    const chargeRate = this.parkForm.get('chargeRate')?.value;
    const power = this.parkForm.get('power')?.value;
    console.log(name, parkRate, chargeRate, this.lat, this.lng, power);

    this.parkForm.valueChanges.subscribe((_) => console.log(_));

    this.http
      .post('/api/car-park', {
        name,
        carSpots,
        parkRate,
        chargeRate,
        lat: this.lat.toString(),
        lng: this.lng.toString(),
        power,
      })
      .subscribe({
        next: (data) => {
          this._snackBar.open('Carpark created', 'Ok');
          setTimeout(() => {
            this._snackBar.dismiss();
          }, 3000);
        },
        error: (error) => {
          this.error = error.error.detail;
          console.log(error.error);
        },
      });
  }

  changing() {
    this.error = '';
  }

  ngOnInit() {
    console.log(this.lat, this.lng);
  }

  back() {
    this._location.back();
  }
}
