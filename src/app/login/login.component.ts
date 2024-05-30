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
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { AuthServiceService } from '../auth-service.service';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  onSumbit() {
    console.log(this.loginForm);

    const username = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (username && password) {
      if (this.authService.login(username, password)) {
        this.router.navigate(['/']);
      } else {
      }
    }

    console.log(username, password);
  }
}
