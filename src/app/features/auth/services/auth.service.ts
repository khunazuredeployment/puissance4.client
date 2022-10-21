import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthModel } from '../models/auth.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private readonly _http: HttpClient
  ) { }

  login(value:any): Observable<AuthModel> {
    return this._http.post<AuthModel>(environment.baseUrl + '/login', value);
  }

  register(value:any): Observable<void> {
    return this._http.post<void>(environment.baseUrl + '/register', value);
  }
}
