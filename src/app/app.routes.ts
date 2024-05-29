import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NewCarParkComponent } from './new-car-park/new-car-park.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

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
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Admin dashboard',
  },
  {
    path: 'new-carpark',
    component: NewCarParkComponent,
    title: 'Add new carpark',
  },
];
