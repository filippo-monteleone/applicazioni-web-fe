import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './confirm-login.component.html',
  styleUrl: './confirm-login.component.css',
})
export class ConfirmLoginComponent {
  registerForm = new FormGroup({
    email: new FormControl<string>(''),
    password: new FormControl<string>(''),
  });

  constructor(private http: HttpClient, private router: Router) {}

  async onSubmit() {
    const invite = this.registerForm.get('invite')?.value;

    this.http
      .post('/api/referal', {})
      .subscribe(() => this.router.navigate(['']));
  }
}
