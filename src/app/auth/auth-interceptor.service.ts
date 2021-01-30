import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AuthService } from "./auth.service";

import * as fromAppRoot from '../store/app.reducer';
import { exhaustMap, map, take } from "rxjs/operators";


@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private store: Store<fromAppRoot.AppState>) {}

  // so executa uma vez, quando faz o fetch, nao fica a escuta
  // exaustMap permite ter 2 observables, espera que o 1 acabe
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth').pipe(
      take(1),
      map(authState => {
        // como estamos no authState, e queremos apenas o user que la esta dentro
        // fazemos um map para passar apenas o user para o exhausMap
        return authState.user;
      }),
      exhaustMap(user => {
        if(!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      })
    )
  }
}
