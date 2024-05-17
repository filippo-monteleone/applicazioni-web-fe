import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as L from 'leaflet';
import { DialogComponent } from './dialog/dialog.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  capitals: string = '/assets/usa-capitals.geojson';

  private openDialogSource = new Subject<any>();

  openedDialog$ = this.openDialogSource.asObservable();

  constructor(private http: HttpClient) {}

  onClick(e: any) {
    this.openDialogSource.next(e);
  }

  makeParkingMarkers(map: L.Map | undefined): void {
    this.http.get(this.capitals).subscribe((res: any) => {
      for (const c of res.features) {
        const lon = c.geometry.coordinates[0];
        const lat = c.geometry.coordinates[1];
        const marker = L.marker([lat, lon]);

        const id = c.properties.state;

        marker.addEventListener('click', (e) => {
          this.openDialogSource.next(e);
        });

        if (map) marker.addTo(map);
      }
    });
  }
}
