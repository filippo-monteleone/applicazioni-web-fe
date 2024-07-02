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
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { Subject } from 'rxjs';
import { PlaceCarParkComponent } from '../place-car-park/place-car-park.component';
import { Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { HttpClient } from '@angular/common/http';

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
  imports: [
    ParkingComponent,
    MatButtonModule,
    MatIcon,
    MatDialogModule,
    PlaceCarParkComponent,
  ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent {
  private map: L.Map | undefined;
  @Output() opened = new EventEmitter<any>();
  didOpen: boolean = false;

  firstWaypoint: L.LatLng | undefined;
  myPosition: L.LatLng | undefined;
  route: L.Routing.Control | undefined;

  changingValue: Subject<{
    id: number;
    currentCharge: number;
    targetCharge: number;
    chargeRateTotalPrice: number;
    chargePricePerSec: number;
    name: string;
    endParking?: Date;
    time: number;
    skip?: boolean;
    chargeCurrent?: number;
    stepCurrent?: number;
    parkCurrent?: number;
    stepPark?: number;
    current?: {
      id: number;
      name: string;
      parkRate: number;
      chargeRate: number;
      inQueue?: boolean;
      pos?: number;
    };
  }> = new Subject();
  retracted: Subject<boolean> = new Subject();

  hideUi: boolean = false;
  isAdmin: boolean = false;

  user: {
    username: string;
    roles: string[];
    balance?: number;
    pro?: boolean;
    battery?: number;
  } = { username: '', roles: [] };

  es: EventSource | undefined;

  @ViewChild(PlaceCarParkComponent) pcp!: PlaceCarParkComponent;

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

    this.map.on('click', (e) => {
      if (this.hideUi) {
        this.routerNav.navigate(['new-carpark'], {
          queryParams: {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
          },
        });
        console.log('ciao');
      }
    });

    this.map
      .getContainer()
      .querySelector('.leaflet-control-container')
      ?.remove();
  }

  constructor(
    private markerService: MarkerService,
    public dialog: MatDialog,
    private routerNav: Router,
    private auth: AuthServiceService,
    private http: HttpClient
  ) {
    this.auth.user.subscribe((val) => {
      console.log(val);
      this.user = val;
      this.isAdmin = this.checkAdmin();
    });

    // this.es = new EventSource('/api/car-park/updates');
    // this.es.onopen = (ev) => {
    //   console.log('aperto');
    // };

    // this.es.onmessage = (ev) => {
    //   console.log('messaggio', ev);
    // };

    // this.es.onerror = (ev) => {
    //   console.log('errore');
    // };

    this.http
      .get<{
        id: number;
        name: string;
        parkRate: number;
        chargeRate: number;
        inQueue?: boolean;
        chargeCurrent?: number;
        stepCurrent?: number;
        parkCurrent?: number;
        stepPark?: number;
        pos?: number;
        endParking?: Date;
      }>('/api/car-park/current')
      .subscribe((_) => {
        console.log('hello', _);
        this.changingValue.next({
          id: _.id,
          currentCharge: 0,
          targetCharge: 0,
          chargeRateTotalPrice: 0,
          chargePricePerSec: 0,
          time: 0,
          name: '',
          endParking: _.endParking,
          skip: true,
          chargeCurrent: _.chargeCurrent,
          stepCurrent: _.stepCurrent,
          parkCurrent: _.parkCurrent,
          stepPark: _.stepPark,
          current: {
            id: _.id,
            name: _.name,
            parkRate: _.parkRate,
            chargeRate: _.chargeRate,
            inQueue: _.inQueue,
            pos: _.pos,
          },
        });
      });

    this.markerService.openedDialog$.subscribe((marker) => {
      if (this.hideUi) return;
      console.log(marker);

      this.firstWaypoint = new L.LatLng(marker.latlng.lat, marker.latlng.lng);

      let info: {
        id: number;
        name: string;
        parkRate: number;
        chargeRate: number;
        queue: number;
      } = marker.target.options;

      console.log(info);

      let mydialog = this.dialog.open(DialogComponent, {
        data: { type: 'buy', info },
        width: 'auto',
      });

      mydialog.afterClosed().subscribe((result) => {
        console.log('28', result);
        if (result) {
          if (this.map && this.firstWaypoint && this.myPosition) {
            this.route?.remove();
            this.route = L.Routing.control({
              router: L.Routing.osrmv1({
                serviceUrl: `https://router.project-osrm.org/route/v1/`,
              }),
              waypoints: [this.firstWaypoint, this.myPosition],
            }).addTo(this.map);
          }
          if (!this.hideUi) this.changingValue.next(result);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((pos) => {
        this.myPosition = new L.LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
      });
    this.initMap();
    this.markerService.makeParkingMarkers(this.map);
  }

  leftParking() {
    this.route?.remove();
  }

  checkAdmin() {
    this.isAdmin = this.user.roles.find((val) => val == 'admin') != undefined;
    console.log(this.isAdmin);
    return this.isAdmin;
  }

  placeMarkerMode() {
    this.hideUi = true;
    this.pcp.expand = true;
    this.pcp.init = true;
  }

  showUi() {
    this.hideUi = false;
    this.pcp.expand = false;
    this.pcp.retract = true;
    console.log(this.pcp.expand);
  }

  openSidebar(): void {
    this.opened.emit(true);
    this.didOpen = true;
  }
}
