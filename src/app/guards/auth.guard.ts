import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class authGuard {
  private authHelper: boolean = false;

  constructor(private authService: AuthServiceService, private router: Router) {
    this.authService.authenticated.subscribe((value) => {
      this.authHelper = value;
      console.log(this.authHelper);
    });
  }

  canActivate() {
    return this.checkAuth();
  }

  private async checkAuth(): Promise<boolean> {
    console.log(await this.authService.isAuthenticatedUser());

    if (await this.authService.isAuthenticatedUser()) return true;
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
