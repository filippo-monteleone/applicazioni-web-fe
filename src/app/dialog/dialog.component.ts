import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

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

  data: {
    type: string;
    info: {
      id: number;
      name: string;
      parkRate: number;
      chargeRate: number;
      queue: number;
    };
  } = inject(MAT_DIALOG_DATA) ?? { type: '' };

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    private http: HttpClient
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
    if (this.phase == 3) this.dialogRef.close(true);
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

  calculateCost(
    valueStart: string,
    valueEnd: string,
    batterySize = 10
  ): string {
    const batteryToCharge =
      (batterySize / 100) * (Number(valueEnd) - Number(valueStart));
    const costOfCharge = this.data.info.chargeRate * batteryToCharge * 100;
    return `${Math.trunc(costOfCharge)}`;
    // return `${Math.trunc(Number(value) * this.energyCost * 100) / 100} €`;
  }

  save(balance: string, battery: string) {
    this.http
      .put('api/user', {
        balance: Number(balance),
        battery: Number(battery),
        pro: this.isChecked,
      })
      .subscribe((_) => console.log(_));
  }
}
