import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class authGuard {
  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  canActivate(): boolean {
    return this.checkAuth();
  }

  private checkAuth(): boolean {
    if (this.authService.isAuthenticatedUser()) return true;
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
