import { CanActivateFn, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class authGuard {
  private authHelper: boolean = false;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private http: HttpClient
  ) {
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

    if (await this.authService.isAuthenticatedUser()) {
      this.http.get('/api/role', {}).subscribe({
        error: (error) => {
          this.router.navigate(['/confirm-login']);
        },
      });
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
