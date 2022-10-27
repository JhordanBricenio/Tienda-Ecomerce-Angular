import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { Categoria } from '../models/categoria';
import { Product } from '../models/producto';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  public url;
  private httheaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private Router: Router) {
    this.url = GLOBAL.url;
  }
  //Get Productos
  getProductos(): Observable<any> {
    return this.http.get(this.url + '/productsss').pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        return throwError(() => e);
      })
    );
  }

  getProducts(page: number): Observable<any> {
    return this.http.get(this.url +'/products' + '/page/' + page).pipe(
      tap((response: any) => {
        (response.content as Product[]).forEach((product) => {
        });
      }),
      map((response: any) => {
        (response.content as Product[]).map((product) => {
          return product;
        });
        return response;
      })
    );
  }

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.url + '/products/categories').pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  getProductsSlug(slug): Observable<any> {
    return this.http.get(this.url +'/products' + '/slug/'+ slug).pipe(
      catchError(e => {
        return throwError(() => e);
      })
    );
  }

  //Get Regiones
  getRegiones(): Observable<any> {
    return this.http.get('./assets/regiones.json');
  }
  getDistritos(): Observable<any> {
    return this.http.get('./assets/distritos.json');
  }
  getProvincias(): Observable<any> {
    return this.http.get('./assets/provincias.json');
  }

  
  
}
