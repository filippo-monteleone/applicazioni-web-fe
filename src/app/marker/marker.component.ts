import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-marker',
  standalone: true,
  imports: [MatIcon, MatButtonModule],
  templateUrl: './marker.component.html',
  styleUrl: './marker.component.css',
})
export class MarkerComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    console.log('test');
    this.dialog.open(DialogComponent, {
      data: { type: 'buy' },
      width: 'auto',
    });
  }
}
