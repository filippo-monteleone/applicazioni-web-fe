import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-confirm-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDivider,
    RouterLink,
  ],
  templateUrl: './confirm-login.component.html',
  styleUrl: './confirm-login.component.css',
})
export class ConfirmLoginComponent {
  codeForm = new FormGroup({
    invite: new FormControl<string>(''),
  });

  constructor(private http: HttpClient, private router: Router) {
    this.http.get('/api/role', {}).subscribe(() => this.router.navigate(['']));
  }

  private skip: boolean = false;
  private map: L.Map | undefined;

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

    this.map.dragging.disable();
    this.map.scrollWheelZoom.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();

    this.map
      .getContainer()
      .querySelector('.leaflet-control-container')
      ?.remove();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  skipMethod() {
    this.http
      .post('/api/role', { invite: 'user' })
      .subscribe(() => this.router.navigate(['']));
  }

  async onSubmit() {
    const invite = this.codeForm.get('invite')?.value;

    this.http
      .post('/api/role', { invite })
      .subscribe(() => this.router.navigate(['']));
  }
}
