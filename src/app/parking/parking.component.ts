import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import dayjs from 'dayjs';
interface payList {
  id?: number;
  current: number;
  step: number;
}

@Component({
  selector: 'app-parking',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatButtonModule],
  templateUrl: './parking.component.html',
  styleUrl: './parking.component.css',
})
export class ParkingComponent {
  arrived: boolean = true;
  price: number = 0;
  shouldRetract: boolean = false;
  expand: boolean = false;
  init: boolean = false;
  inTraffic: boolean = true;
  info:
    | {
        id: number;
        currentCharge: number;
        targetCharge: number;
        chargeRateTotalPrice: number;
        chargePricePerSec: number;
        chargeRate?: number;
        parkRate?: number;
        time: number;
        name: string;
        endParking?: Date;
        skip?: boolean;
        current?: {
          id: number;
          name: string;
          parkRate: number;
          chargeRate: number;
          inQueue?: boolean;
          pos?: number;
        };
        chargeCurrent?: number;
        stepCurrent?: number;
        parkCurrent?: number;
        stepPark?: number;
        battery?: number;
        batteryStep?: number;
      }
    | undefined;
  @Input() shouldExpand: Subject<{
    id: number;
    currentCharge: number;
    targetCharge: number;
    chargeRateTotalPrice: number;
    chargePricePerSec: number;
    name: string;
    time: number;
    skip?: boolean;
    endParking?: Date;
    chargeCurrent?: number;
    stepCurrent?: number;
    parkCurrent?: number;
    stepPark?: number;
    battery?: number;
    batteryStep?: number;
    current?: {
      id: number;
      name: string;
      parkRate: number;
      chargeRate: number;
      inQueue?: boolean;
      pos?: number;
    };
  }> = new Subject();
  @Output() shouldRetractSub: EventEmitter<boolean> = new EventEmitter();

  cars: number | undefined;
  priceParking: number = 0;
  pricePower: number = 0;
  name: string | undefined;
  endAt: Date = new Date();

  batteryPower: number = 0;
  es: EventSource | undefined;
  howLongWillItTake: number = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.shouldExpand.subscribe(async (v) => {
      console.log('qua', v);

      this.expand = true;
      this.init = true;
      if (v.skip) {
        this.inTraffic = false;
        this.arrived = true;
      }
      console.log('value is changing', v);
      this.info = v;
      this.batteryPower = this.info.currentCharge;

      this.pricePower = this.info.chargeRate!;
      this.priceParking = this.info.parkRate!;
      this.name = this.info.name;

      if (this.info.endParking) {
        console.log(this.info, 'eee');

        let powerInterval = setInterval(() => {
          // console.log(this.shouldRetract);
          // this.shouldExpand = !this.shouldExpand;

          if (this.price < this.info?.chargeCurrent!)
            this.price = this.info?.chargeCurrent!;

          this.price += this.info?.stepCurrent! + this.info?.stepPark!;
          this.price = Number(this.price.toFixed(2));

          if (this.batteryPower < this.info?.battery!)
            this.batteryPower = this.info?.battery!;

          this.batteryPower += this.info?.batteryStep!;
          this.batteryPower = Number(this.batteryPower.toFixed(2));
        }, 1000);

        let leaveTimeout = setTimeout(() => {
          this.retract();
          this.price = 0;
          clearInterval(powerInterval);
        }, dayjs(this.info.endParking).valueOf() - new Date().getTime());
      }

      if (v.current?.inQueue) {
        this.inTraffic = false;
        this.arrived = false;

        this.cars = v.current.pos;
        this.priceParking = v.current.parkRate;
        this.pricePower = v.current.chargeRate;
        this.name = v.current.name;
      }
      if (v.current) {
        this.priceParking = v.current.parkRate;
        this.pricePower = v.current.chargeRate;
        this.name = v.current.name;
        this.price = Number(localStorage.getItem('price'));
      }
    });

    this.es = new EventSource('/api/car-park/updates');
    this.es.onopen = (ev) => {
      console.log('aperto');
    };

    this.es.onmessage = (ev) => {
      this.cars = Number(ev.data);
      if (this.cars == -1) {
        this.inTraffic = false;
        this.arrived = true;

        let chargeInterval = setInterval(() => {
          this.price += this.info?.parkRate! / 60 / 60;
          this.price = Number(this.price.toFixed(2));
          console.log(this.price, this.info?.parkRate! / 60 / 60);
        }, 1000);

        let leaveTimeout = setTimeout(() => {
          this.retract();
          this.price = 0;
          clearInterval(chargeInterval);
        }, this.info?.time! * 60 * 60 * 1000);

        console.log('29', this.price);

        let powerInterval = setInterval(() => {
          // console.log(this.shouldRetract);
          // this.shouldExpand = !this.shouldExpand;

          this.price += this.info?.chargePricePerSec!;
          this.price = Number(this.price.toFixed(2));

          let t = this.info?.targetCharge! - this.info?.currentCharge!;
          t = t / (this.info?.time! * 60 * 60);
          console.log(t, 'controlla');
          console.log(this.info?.time);
          this.batteryPower += t;
          this.batteryPower = Number(this.batteryPower.toFixed(2));

          if (this.price >= this.info?.chargeRateTotalPrice!) {
            clearInterval(powerInterval);
          }
        }, 1000);
      }

      console.log('messaggio', ev);
    };

    this.es.onerror = (ev) => {
      console.log('errore');
    };
  }

  retract() {
    this.expand = false;
    this.shouldRetractSub.emit(true);
    this.arrived = false;
    this.inTraffic = true;
    this.http.post('/api/payments/settle', {}).subscribe((_) => console.log(_));
    // this.shouldRetract = true;
  }

  checkIn() {
    this.http
      .post<{ status: string; endParking: string }>(
        `/api/car-park/${this.info?.id}/park`,
        this.info
      )
      .subscribe((_) => {
        console.log('qua', _);
        this.endAt = new Date(_.endParking);

        if (_.status == 'Full') {
          this.inTraffic = false;
          this.arrived = false;
        } else {
          this.inTraffic = false;
          this.arrived = true;

          let chargeInterval = setInterval(() => {
            this.price += this.info?.parkRate! / 60 / 60;
          }, 1000);

          let powerInterval = setInterval(async () => {
            // console.log(this.shouldRetract);
            // this.shouldExpand = !this.shouldExpand;

            this.price += this.info?.chargePricePerSec!;

            let t = this.info?.targetCharge! - this.info?.currentCharge!;
            t = t / (this.info?.time! * 60 * 60);
            this.batteryPower += t;
          }, 1000);

          let leaveTimeout = setTimeout(() => {
            this.retract();
            clearInterval(chargeInterval);
            clearInterval(powerInterval);
            this.price = 0;
          }, this.endAt.getTime() - new Date().getTime());
        }
      });
  }
}
