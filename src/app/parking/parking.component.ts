import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { Subject, of } from 'rxjs';

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
  @Input() shouldExpand: Subject<boolean> = new Subject();

  constructor() {
    setInterval(() => {
      console.log(this.shouldRetract);
      // this.shouldExpand = !this.shouldExpand;
      this.price += 0.1;
    }, 2000);
  }

  ngOnInit() {
    this.shouldExpand.subscribe((v) => {
      this.expand = true;
      this.init = true;
      console.log('value is changing', v);
    });
  }

  retract() {
    this.expand = false;
    // this.shouldRetract = true;
  }
}
