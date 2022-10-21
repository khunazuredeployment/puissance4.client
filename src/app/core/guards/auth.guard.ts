import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, tap } from 'rxjs';
import { SessionState } from '../states/session.reducers';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private readonly _store: Store<{ session: SessionState }>,
    private readonly _router: Router,
  ){ }

  canLoad(
    route: Route, 
    segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this._store.select(state => state.session.isConnected).pipe(tap(isConnected => {
        if(!isConnected) {
          this._router.navigate(['auth']);
        }
      }));
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this._store.select(state => state.session.isConnected).pipe(tap(isConnected => {
        if(!isConnected) {
          this._router.navigate(['auth']);
        }
      }));
  }


  
  
}
