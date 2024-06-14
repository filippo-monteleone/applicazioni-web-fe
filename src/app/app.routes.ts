import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewCarParkComponent } from './new-car-park/new-car-park.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './guards/auth.guard';
import { ConfirmLoginComponent } from './confirm-login/confirm-login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: 'register',
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home page',
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Admin dashboard',
    canActivate: [authGuard],
  },
  {
    path: 'new-carpark',
    component: NewCarParkComponent,
    title: 'Add new carpark',
    canActivate: [authGuard],
  },
  {
    path: 'confirm-login',
    component: ConfirmLoginComponent,
    canActivate: [authGuard],
  },
  {
    path: 'api/confirm-login',
    redirectTo: 'confirm-login',
  },
];
