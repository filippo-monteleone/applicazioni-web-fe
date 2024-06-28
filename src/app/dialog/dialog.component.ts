import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import dayjs from 'dayjs';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../auth-service.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    MatChipsModule,
    MatSliderModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  subscription: boolean;
  energyCost: number;
  phase: number;
  isChecked: boolean = false;
  cost: string = '0';
  time: string = '0';
  currentCharge: number = 0;
  targetCharge: number = 0;
  mins: number = 0;
  hrs: number = 0;
  realtime: number = 0;

  data: {
    type: string;
    info: {
      id: number;
      name: string;
      parkRate: number;
      chargeRate: number;
      queue: number;
      totalChargePrice: number;
      chargePricePerSec: number;
    };
  } = inject(MAT_DIALOG_DATA) ?? { type: '' };

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private http: HttpClient,
    private auth: AuthServiceService
  ) {
    this.phase = 1;
    this.energyCost = 0.2;
    this.subscription = false;
  }

  ngOnInit() {
    console.log(this.data);
  }

  nextPhase() {
    this.phase++;

    if (this.phase == 3) this.realtime += this.hrs + this.mins / 60;

    if (this.phase == 4) {
      // this.http
      //   .post(`/api/car-park/${this.data.info.id}/park`, {
      //     currentCharge: this.currentCharge,
      //     targetCharge: this.targetCharge,
      //     time: this.realtime,
      //   })
      //   .subscribe((_) => console.log(_));
      this.dialogRef.close({
        id: this.data.info.id,
        currentCharge: this.currentCharge,
        targetCharge: this.targetCharge,
        time: this.realtime,
        parkRate: this.data.info.parkRate,
        chargeRate: this.data.info.chargeRate,
        chargeRateTotalPrice: this.data.info.totalChargePrice,
        chargePricePerSec: this.data.info.chargePricePerSec,
        name: this.data.info.name,
      });
    }
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

  calculate(
    valueStart: string,
    valueEnd: string,
    batterySize = 10,
    power = 10
  ) {
    this.cost = this.calculateCost(valueStart, valueEnd, batterySize);
    this.time = this.calcualteTime(valueStart, valueEnd, batterySize, power);

    let c = Number(this.cost);

    this.data.info.chargePricePerSec = c / (this.realtime * 60 * 60);
    this.data.info.totalChargePrice = Number(this.cost);

    this.currentCharge = Number(valueStart);
    this.targetCharge = Number(valueEnd);

    return { cost: this.cost, time: this.time };
  }

  calculateCost(
    valueStart: string,
    valueEnd: string,
    batterySize = 10
  ): string {
    const batteryToCharge =
      (batterySize / 100) * (Number(valueEnd) - Number(valueStart));
    const costOfCharge = this.data.info.chargeRate * batteryToCharge;

    this.data.info.totalChargePrice = costOfCharge;

    return `${Math.trunc(costOfCharge)}`;
    // return `${Math.trunc(Number(value) * this.energyCost * 100) / 100} €`;
  }

  calcualteTime(
    valueStart: string,
    valueEnd: string,
    batterySize = 10,
    power = 10
  ) {
    const batteryToCharge =
      (batterySize / 100) * (Number(valueEnd) - Number(valueStart));

    const time = batteryToCharge / power;

    let minutes = time % 1;

    this.realtime = time;

    // console.log(
    //   batteryToCharge,
    //   power,
    //   Math.trunc(time),
    //   Math.trunc(minutes * 60)
    // );

    return `${Math.trunc(time)} hrs ${Math.trunc(minutes * 60)} mins`;
  }

  save(balance: string, battery: string) {
    this.http
      .put('api/user', {
        balance: Number(balance),
        battery: Number(battery),
        pro: this.isChecked,
      })
      .subscribe((_) => console.log(_));

    this.http
      .get<{
        balance: number;
        battery: number;
        pro: boolean;
        username: string;
      }>('/api/user')
      .subscribe((user) => {
        console.log(user);
        this.http.get<string[]>('/api/role').subscribe((role) => {
          this.auth.user.next({ ...user, roles: role });
        });
      });
  }
}
