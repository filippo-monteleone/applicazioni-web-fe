import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthServiceService } from '../auth-service.service';
import * as L from 'leaflet';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    MatInputModule,
    MatIcon,
    MatDivider,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });
  private map: L.Map | undefined;

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router,
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {}

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

  google() {
    // this.router.navigate(['/external-login']);
    window.location.href = 'https://localhost:7013/api/external-login';
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  async onSumbit() {
    console.log(this.loginForm);

    const username = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (username && password) {
      this.authService.login(username, password);
      this.authService.user.subscribe((data) => {
        if (data.error)
          this._snackBar.open('Username or email are not correct', 'Ok', {
            duration: 3000,
          });
        if (data.username != '') {
          this.router.navigate(['/']);
        }
      });
    }
    console.log(username, password);
  }
}
