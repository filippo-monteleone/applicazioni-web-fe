import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {}
