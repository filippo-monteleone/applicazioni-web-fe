import { Component, Inject, inject } from '@angular/core';
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
import { Observable, of } from 'rxjs';

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
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent {
  subscription: boolean;
  energyCost: number;
  phase: number;

  data: { type: string } = inject(MAT_DIALOG_DATA) ?? { type: '' };

  constructor(public dialogRef: MatDialogRef<DialogComponent>) {
    this.phase = 1;
    this.energyCost = 0.2;
    this.subscription = false;
  }

  nextPhase() {
    this.phase++;
    if (this.phase == 3) this.dialogRef.close(true);
  }

  formatLabel(value: number): string {
    return `${value}%`;
  }

  calculateCost(value: string): string {
    return `${Math.trunc(Number(value) * this.energyCost * 100) / 100} €`;
  }
}
