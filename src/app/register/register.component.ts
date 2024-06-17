import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { MatCardModule } from '@angular/material/card';
import * as L from 'leaflet';

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
    code: new FormControl<string>(''),
  });
  private invite: string | undefined;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.invite = params['invite'];
    });
  }

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

  async onSubmit() {
    const username = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;
    let invite = this.registerForm.get('code')?.value;
    console.log(username, password, invite);

    if (invite == null) invite = undefined;

    if (username && password) {
      this.authService.register(username, password, invite);
      this.authService.user.subscribe((data) => {
        if (data.username != '') this.router.navigate(['/']);
      });
    }
  }
}
