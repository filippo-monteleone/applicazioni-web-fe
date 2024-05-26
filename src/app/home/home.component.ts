import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { MatCardModule } from '@angular/material/card';
import { ParkingComponent } from '../parking/parking.component';
import { MarkerComponent } from '../marker/marker.component';
import { MapComponent } from '../map/map.component';
import { SharedHomeDashboardService } from '../shared-home-dashboard.service';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatCardModule,
    ParkingComponent,
    MarkerComponent,
    MapComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  opened: boolean = false;

  constructor(public dialog: MatDialog, private route: ActivatedRoute) {}

  openSidebar(): void {
    this.opened = true;
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => console.log(params));

    // this.sharedService
    //   .getData()
    //   .pipe(takeUntil(this.unsubscribe))
    //   .subscribe((data) => {
    //     console.log(data);
    //   });
  }

  openDialog(): void {
    this.dialog.open(DialogComponent, {
      width: 'auto',
    });
  }
}
