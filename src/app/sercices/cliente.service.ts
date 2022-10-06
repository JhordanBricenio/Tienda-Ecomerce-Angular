import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from '../models/carrito';
import { GLOBAL } from './GLOBAL';
import { catchError, Observable, throwError } from 'rxjs';


declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  
  public url;
  private httheaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private Router: Router) {
    this.url = GLOBAL.url;
  }

  agregarCarrito(carrito:any){
    return this.http.post(this.url + '/carrito', carrito, { headers: this.httheaders });
  }

  getCarrito(id): Observable<any>{
    return this.http.get(this.url + '/carrito/'+id);
  }

  delete(id: number): Observable<Carrito> {
    return this.http
      .delete<Carrito>(`${this.url}/carrito/${id}`, {
        headers: this.httheaders,
      })
      .pipe(
        catchError((e) => {
          console.log(e.error.mensaje);
          iziToast.error({
            title: 'Error',
            message: e.error.mensaje,
          });
         // Swal.fire(e.error.mensaje, e.error.error, 'error');
          //return throwError(e);
          return throwError(() => e);
        })
      );
  }
}
