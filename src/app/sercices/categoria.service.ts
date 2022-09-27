import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { Categoria } from '../models/categoria';
import { Product } from '../models/producto';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  public url;
  constructor(private http: HttpClient, private Router: Router) {
    this.url = GLOBAL.url;
  }

  getProductosPorCategoria(id): Observable<any> {
    return this.http.get<any>(`${this.url+'/products/categoria'}/${id}`).pipe(
      catchError((e) => {
        console.log(e.error.mensaje);
        return throwError(() => e);
      })
    );
  }

}
