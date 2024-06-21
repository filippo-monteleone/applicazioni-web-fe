import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private isAuthenticated = false;
  private authSecretKey = 'Bearer Token';
  public user = new Subject<{
    username: string;
    roles: string[];
    balance?: number;
  }>();
  public username = new ReplaySubject<string>();
  public authenticated = new ReplaySubject<boolean>();

  constructor(public http: HttpClient) {
    this.isAuthenticated = !!localStorage.getItem(this.authSecretKey);
    this.user.next({ username: '', roles: [], balance: 0 });
  }

  login(username: string, password: string) {
    this.http.post('api/login', { username, password }).subscribe(() => {
      this.http
        .get<{ username: string; balance: number }>('/api/user')
        .subscribe((user) => {
          this.username.next(username);
          this.user.next({
            username: user.username,
            roles: [],
            balance: user.balance,
          });
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
          this.user.next({ username: user.username, roles: [], balance: 0 });
        });

        const authToken = 'testoken';
        localStorage.setItem(this.authSecretKey, authToken);
        this.isAuthenticated = true;
      });
  }

  async isAuthenticatedUser(): Promise<boolean> {
    // let user = await firstValueFrom(this.http.get('api/user').s);
    // console.log(user);

    try {
      await firstValueFrom(this.http.get('api/user'));
      return true;
    } catch {
      return false;
    }
  }

  setAuth(val: boolean) {
    this.isAuthenticated = val;
  }

  getUser() {
    console.log(this.username);
  }
}
