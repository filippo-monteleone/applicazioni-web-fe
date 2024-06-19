import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, Location, NgFor } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SharedHomeDashboardService } from '../shared-home-dashboard.service';
import { NavigationExtras, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

const PARK_DATA: ParkSpot[] = [
  { position: 1, name: 'Hydrogen', free: true },
  { position: 2, name: 'Helium', free: true },
  { position: 3, name: 'Lithium', free: true },
  { position: 4, name: 'Beryllium', free: true },
  { position: 5, name: 'Boron', free: false },
  { position: 6, name: 'Carbon', free: true },
  { position: 7, name: 'Nitrogen', free: true },
  { position: 8, name: 'Oxygen', free: true },
  { position: 9, name: 'Fluorine', free: true },
  { position: 10, name: 'Neon', free: true },
];

const PAY_DATA: Payment[] = [
  { type: 'Parking', name: 'Boron', userType: 'Premium', cost: 25.5 },
];

export interface Payment {
  type: string;
  name: string;
  userType: string;
  cost: number;
}

export interface CarPark {
  id: number;
  name: string;
  parkRate: number;
  chargeRate: number;
}

export interface ParkSpot {
  name: string;
  position: number;
  free: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatExpansionModule,
    MatDividerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatIcon,
    MatPaginatorModule,
    MatCheckboxModule,
    MatButtonModule,
    NgFor,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  selectedVal: string | undefined;
  price: number | undefined;
  parkSource = PARK_DATA;
  paymentSource = PAY_DATA;
  length: number = 0;

  carParks: CarPark[] | undefined;

  displayedColumns: string[] = ['position', 'name'];
  paymentDisplayedColumns: string[] = ['Paid for', 'Username', 'Type', 'Cost'];

  hidePageSize: boolean = true;

  constructor(
    private _location: Location,
    private router: Router,
    public http: HttpClient
  ) {
    this.http.get<string[]>('api/role').subscribe((val) => {
      if (val.find((x) => x == 'admin') == undefined) {
        this.router.navigate(['/']);
      }
    });

    this.http
      .get<CarPark[]>('/api/car-park?me=true')
      .subscribe((_) => (this.carParks = _));
  }

  onAccOpen(i: number) {
    console.log(i);
    this.http
      .get<{ length: number }>(
        `/api/car-park/${i}/car-spots?page=1&resultsPerPage=10`
      )
      .subscribe((_) => {
        this.length = _.length;
      });
  }

  ngOnInit() {
    this.selectedVal = 'carparks';
    this.price = 5;
  }
  public onValChange(val: string) {
    console.log(this.selectedVal);
    this.selectedVal = val;
  }

  handlePageEvent(e: PageEvent, i: number) {
    console.log(i);
    // this.http
    // .get(`/api/car-park/${i}/car-spots?page=1&resultsPerPage=10`)
    // .subscribe();
    this.http
      .get<{ length: number }>(
        `/api/car-park/${i}/car-spots?page=${e.pageIndex + 1}&resultsPerPage=10`
      )
      .subscribe((_) => {
        this.length = _.length;
      });
    console.log(e, 'negro');
  }

  delete(i: number) {
    if (this.carParks) {
      this.http
        .delete(`/api/car-park/${this.carParks?.at(i)?.id}`)
        .subscribe((_) => {
          if (this.carParks) this.carParks.splice(i, 1);
        });
    }
  }

  back() {
    this._location.back();
  }

  openMap() {
    let navigationExtras: NavigationExtras = {
      queryParams: { test: true },
    };

    this.router.navigate(['/'], navigationExtras);
    // this.sharedService.setData('Close');
  }
}
