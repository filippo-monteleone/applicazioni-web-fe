import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private isAuthenticated = false;

  constructor() {}

  login(username: string, password: string): boolean {
    if (username === 'Test' && password === 'Test') {
      this.isAuthenticated = true;
      return true;
    } else {
      return false;
    }
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }
}
