import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private isAuthenticated = false;
  private authSecretKey = 'Bearer Token';
  public user = new Subject<string>();
  public username = new ReplaySubject<string>();

  constructor(public http: HttpClient) {
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
    this.user.next('');
  }

  login(username: string, password: string) {
    this.http.post('api/login', { username, password }).subscribe(() => {
      this.http.get<{ username: string }>('/api/user').subscribe((user) => {
        this.username.next(username);
        this.user.next(user.username);
      });

      const authToken = 'testoken';
      localStorage.setItem(this.authSecretKey, authToken);
      this.isAuthenticated = true;
    });
  }

  register(username: string, password: string, invite?: string) {
    this.http
      .post(invite ? `api/register?invite=${invite}` : `api/register`, {
        username,
        password,
      })
      .subscribe((_) => {
        this.http.get<{ username: string }>('/api/user').subscribe((user) => {
          this.username.next(username);
          this.user.next(user.username);
        });

        const authToken = 'testoken';
        localStorage.setItem(this.authSecretKey, authToken);
        this.isAuthenticated = true;
      });
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  getUser() {
    console.log(this.username);
  }
}
