import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;

  //private currentUserSource = new BehaviorSubject<IUser | null>(null);
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  getCurrentUser(token: string | null) {
    if (token) {
      let headers = new HttpHeaders();
      headers = headers.set('Authorization', `Bearer ${token}`);
      return this.http.get<IUser>(this.baseUrl + "account", { headers }).pipe(
        map(user => {
          if (user) {
            localStorage.setItem("token", user.token);
            this.currentUserSource.next(user);
          }
        })
      );
    }
    else {
      this.currentUserSource.next(null);
      return null;
    }
  }

  login(values: any) {
    return this.http.post<IUser>(this.baseUrl + "account/login", values).pipe(
      map(user => {
        if (user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post<IUser>(this.baseUrl + "account/register", values).pipe(
      map(user => {
        if (user) {
          localStorage.setItem("token", user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem("token");
    this.currentUserSource.next(null);
    this.router.navigateByUrl("/");
  }

  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + "account/emailexists?email=" + email);
  }
}
