import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {catchError, map} from 'rxjs/operators';
import {AuthResponse} from "../login/auth.response";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'authToken';

  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(private httpClient: HttpClient, private router: Router) {
    const token = localStorage.getItem(this.tokenKey);
    this.isLoggedInSubject = new BehaviorSubject<boolean>(!!token);
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient.post<AuthResponse>('http://localhost:8080/api/authenticate',
      {'username': username, 'password': password})
      .pipe(
        map(responseData => {
          this.setToken(responseData.jwt)
          this.isLoggedInSubject.next(true);
          this.router.navigate(['/patients']);
          return responseData;
        }),
        catchError(errorResponse => {
          return throwError(errorResponse);
        })
      )
  }

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false)
    this.router.navigate(['/']);
  }
}
