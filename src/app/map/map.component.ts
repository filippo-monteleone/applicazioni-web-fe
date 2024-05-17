import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { ParkingComponent } from '../parking/parking.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MarkerService } from '../marker.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ParkingComponent, MatButtonModule, MatIcon],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  private map: L.Map | undefined;
  @Output() opened = new EventEmitter<boolean>();
  didOpen: boolean = false;

  private initMap(): void {
    this.map = L.map('map', {
      zoomControl: false,
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: `http://router.project-osrm.org/route/v1/`,
      }),
      waypoints: [L.latLng(57.74, 11.94), L.latLng(57.6792, 11.949)],
    }).addTo(this.map);

    console.log(
      this.map.getContainer().querySelector('.leaflet-routing-container')
    );

    this.map
      .getContainer()
      .querySelector('.leaflet-routing-container')
      ?.remove();
  }

  constructor(private markerService: MarkerService, public dialog: MatDialog) {
    markerService.openedDialog$.subscribe((marker) => {
      this.dialog.open(DialogComponent, {
        data: { type: 'buy' },
        width: 'auto',
      });
      console.log(marker);
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeParkingMarkers(this.map);
  }

  openSidebar(): void {
    this.opened.emit(true);
    this.didOpen = true;
  }
}