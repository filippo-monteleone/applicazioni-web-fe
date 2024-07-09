import { Component, ViewChild } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, Location, NgFor } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
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
  {
    type: 'Parking',
    name: 'Boron',
    userType: 'Premium',
    cost: 25.5,
    dateEnd: new Date(),
    dateStart: new Date(),
  },
];

export interface Payment {
  type: string;
  name: string;
  userType: string;
  cost: number;
  dateStart: Date;
  dateEnd: Date;
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
    FormsModule,
    ReactiveFormsModule,
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
  page: number = 1;

  carParks: CarPark[] | undefined;

  displayedColumns: string[] = ['position', 'name'];
  paymentDisplayedColumns: string[] = ['Paid for', 'Username', 'Type', 'Cost'];

  hidePageSize: boolean = true;

  payments: Payment[] | undefined;
  filteredPayments: Payment[] | undefined;

  startDate: Date | undefined;
  endDate: Date | undefined;

  @ViewChild('paginator') paginator!: MatPaginator;

  filtersObj: {
    Start: number | undefined;
    End: number | undefined;
    Parking: boolean;
    Charging: boolean;
    Basic: boolean;
    Premium: boolean;
  } = {
    Start: 0,
    End: 0,
    Parking: true,
    Charging: true,
    Basic: true,
    Premium: true,
  };

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
      .get<{
        carSpots: {
          id: number;
          userId: number;
        }[];
        length: number;
      }>(`/api/car-park/${i}/car-spots?page=1&resultsPerPage=10`)
      .subscribe((_) => {
        let parkSpots: ParkSpot[] = [];

        _.carSpots.forEach((element) => {
          parkSpots.push({
            name: element.userId?.toString(),
            position: element.id,
            free: element.userId == null,
          });
        });

        console.log(parkSpots);
        this.parkSource = parkSpots;
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
    if (this.selectedVal == 'stats')
      this.http
        .get<{
          invoices: {
            type: string;
            userId: string;
            paid: number;
            pro: boolean;
            dateStart: Date;
            dateEnd: Date;
          }[];
          length: number;
        }>(`/api/payments?page=1&resultsPerPage=10`)
        .subscribe((_) => {
          let payments: Payment[] = [];

          _.invoices.forEach((element) => {
            payments.push({
              type: element.type,
              name: element.userId,
              userType: element.pro ? 'Pro' : 'Basic',
              cost: element.paid,
              dateStart: element.dateStart,
              dateEnd: element.dateEnd,
            });
          });

          this.payments = payments;
          this.filteredPayments = payments;

          this.paymentSource = payments;
          this.length = _.length;
        });
  }

  handlePageEvent(e: PageEvent, i: number) {
    console.log(this.selectedVal);
    // this.http
    // .get(`/api/car-park/${i}/car-spots?page=1&resultsPerPage=10`)
    // .subscribe();
    if (this.selectedVal == 'carparks') {
      this.http
        .get<{ length: number }>(`/api/car-park/${i}/car-spots`, {
          params: {
            page: e.pageIndex + 1,
            resultsPerPage: 10,
          },
        })
        .subscribe((_) => {
          this.length = _.length;
        });
    } else {
      let query: {
        page: number;
        resultsPerPage: number;
        startDate?: number;
        endDate?: number;
        parking?: boolean;
        charging?: boolean;
        basic?: boolean;
        premium?: boolean;
      } = {
        page: e.pageIndex + 1,
        resultsPerPage: 10,
        startDate: this.startDate?.valueOf(),
        endDate: this.endDate?.valueOf(),
        parking: this.filtersObj.Parking,
        charging: this.filtersObj.Charging,
        basic: this.filtersObj.Basic,
        premium: this.filtersObj.Premium,
      };
      if (this.startDate == undefined)
        query = {
          page: e.pageIndex + 1,
          resultsPerPage: 10,
          parking: this.filtersObj.Parking,
          charging: this.filtersObj.Charging,
          basic: this.filtersObj.Basic,
          premium: this.filtersObj.Premium,
        };

      this.http
        .get<{
          length: number;
          invoices: {
            type: string;
            userId: string;
            paid: number;
            pro: boolean;
            dateStart: Date;
            dateEnd: Date;
          }[];
        }>(`/api/payments`, {
          params: query,
        })
        .subscribe((_) => {
          let payments: Payment[] = [];

          _.invoices.forEach((element) => {
            payments.push({
              type: element.type,
              name: element.userId,
              userType: element.pro ? 'Pro' : 'Basic',
              cost: element.paid,
              dateStart: element.dateStart,
              dateEnd: element.dateEnd,
            });
          });

          this.payments = payments;
          this.filteredPayments = payments;

          this.paymentSource = payments;
          this.length = _.length;
        });
    }
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

  filters(
    check: boolean,
    index: 'Start' | 'End' | 'Basic' | 'Premium' | 'Charging' | 'Parking'
  ) {
    // let payments = this.filteredPayments!;

    switch (index) {
      case 'Start':
        this.filtersObj[index] = this.startDate?.valueOf();
        break;
      case 'End':
        this.filtersObj[index] = this.endDate?.valueOf();
        break;
      case 'Basic':
        this.filtersObj[index] = check;
        break;
      case 'Premium':
        this.filtersObj[index] = check;
        break;
      case 'Charging':
        this.filtersObj[index] = check;
        break;
      case 'Parking':
        this.filtersObj[index] = check;
        break;
    }

    // payments = payments.filter((p) => {
    //   if (!check) {
    //     if (index == 'Basic' && p.userType == 'Basic') return false;
    //     if (index == 'Premium' && p.userType == 'Pro') return false;
    //     if (index == 'Charging' && p.type == 'Charge') return false;
    //     if (index == 'Parking' && p.type == 'Parking') return false;
    //   }

    //   return true;
    // });

    // let remainingPayments = this.payments!.filter((p) => {
    //   if (check) {
    //     if (index == 'Basic' && p.userType == 'Basic') return true;
    //     if (index == 'Premium' && p.userType == 'Pro') return true;
    //     if (index == 'Charging' && p.type == 'Charge') return true;
    //     if (index == 'Parking' && p.type == 'Parking') return true;

    //     if (index == 'Start' && p.dateStart > this.startDate!) {
    //       return true;
    //     } else if (index == 'End' && p.dateEnd < this.endDate!) {
    //       return true;
    //     }
    //   }

    //   return false;
    // });

    // let temp: Payment[] = [];

    // payments.forEach((p) => {
    //   for (let r of remainingPayments) {
    //     if (r.dateStart != p.dateStart && r.name != p.name) temp.push(r);
    //   }

    //   temp.push(p);
    // });

    // console.log(temp);

    // payments = temp;

    // this.paymentSource = temp.filter((p) => {
    //   console.log(p.dateStart, p.dateEnd);

    //   if (index != 'Start' && index != 'End') return true;

    //   if (this.startDate == undefined && p.dateEnd < this.endDate!) {
    //     return true;
    //   } else if (this.endDate == undefined && p.dateStart > this.startDate!) {
    //     return true;
    //   } else if (p.dateStart > this.startDate! && p.dateEnd < this.endDate!) {
    //     return true;
    //   }

    //   return false;
    // });
    // console.log(this.paymentSource);
    let query: {
      page: number;
      resultsPerPage: number;
      startDate?: number;
      endDate?: number;
      parking?: boolean;
      charging?: boolean;
      basic?: boolean;
      premium?: boolean;
    } = {
      page: 1,
      resultsPerPage: 10,
      startDate: this.startDate?.valueOf(),
      endDate: this.endDate?.valueOf(),
      parking: this.filtersObj.Parking,
      charging: this.filtersObj.Charging,
      basic: this.filtersObj.Basic,
      premium: this.filtersObj.Premium,
    };
    if (this.startDate == undefined)
      query = {
        page: 1,
        resultsPerPage: 10,
        parking: this.filtersObj.Parking,
        charging: this.filtersObj.Charging,
        basic: this.filtersObj.Basic,
        premium: this.filtersObj.Premium,
      };

    this.http
      .get<{
        length: number;
        invoices: {
          type: string;
          userId: string;
          paid: number;
          pro: boolean;
          dateStart: Date;
          dateEnd: Date;
        }[];
      }>(`/api/payments`, {
        params: query,
      })
      .subscribe((_) => {
        let payments: Payment[] = [];

        this.paginator.firstPage();

        _.invoices.forEach((element) => {
          payments.push({
            type: element.type,
            name: element.userId,
            userType: element.pro ? 'Pro' : 'Basic',
            cost: element.paid,
            dateStart: element.dateStart,
            dateEnd: element.dateEnd,
          });
        });

        this.payments = payments;
        this.filteredPayments = payments;

        this.paymentSource = payments;
        this.length = _.length;
      });
  }
}
