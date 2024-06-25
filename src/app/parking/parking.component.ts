import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Subject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

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
        time: number;
        skip?: boolean;
      }
    | undefined;
  @Input() shouldExpand: Subject<{
    id: number;
    currentCharge: number;
    targetCharge: number;
    time: number;
    skip?: boolean;
  }> = new Subject();
  @Output() shouldRetractSub: EventEmitter<boolean> = new EventEmitter();

  constructor(private http: HttpClient) {
    setInterval(() => {
      // console.log(this.shouldRetract);
      // this.shouldExpand = !this.shouldExpand;
      this.price += 0.1;
    }, 2000);
  }

  ngOnInit() {
    this.shouldExpand.subscribe((v) => {
      this.expand = true;
      this.init = true;
      if (v.skip) {
        this.inTraffic = false;
        this.arrived = true;
      }
      console.log('value is changing', v);
      this.info = v;
    });
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
      .post(`/api/car-park/${this.info?.id}/park`, this.info)
      .subscribe((_) => (this.inTraffic = false));
    console.log(this.info);
  }
}
