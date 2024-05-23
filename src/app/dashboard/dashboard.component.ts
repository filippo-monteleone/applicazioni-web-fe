import { Component } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Location } from '@angular/common';

const ELEMENT_DATA: PeriodicElement[] = [
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

export interface PeriodicElement {
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  selectedVal: string | undefined;
  price: number | undefined;
  dataSource = ELEMENT_DATA;
  displayedColumns: string[] = ['position', 'name'];
  constructor(private _location: Location) {}

  ngOnInit() {
    this.selectedVal = 'carparks';
    this.price = 5;
  }
  public onValChange(val: string) {
    console.log(this.selectedVal);
    this.selectedVal = val;
  }

  back() {
    this._location.back();
  }
}
