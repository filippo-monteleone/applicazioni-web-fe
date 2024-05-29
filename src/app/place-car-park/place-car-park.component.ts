import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-place-car-park',
  standalone: true,
  imports: [MatCardModule, MatIcon, MatButtonModule],
  templateUrl: './place-car-park.component.html',
  styleUrl: './place-car-park.component.css',
})
export class PlaceCarParkComponent {
  expand: boolean = false;
  retract: boolean = true;
  init: boolean = false;
  @Output() closeEvent = new EventEmitter<boolean>();

  constructor() {
    setInterval(() => console.log(this.expand));
  }

  close() {
    this.expand = false;
    this.retract = true;
    this.closeEvent.emit(true);
  }
}
