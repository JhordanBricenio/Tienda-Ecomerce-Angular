import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';
import { GLOBAL } from './GLOBAL';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  public url;
  private httheaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private Router: Router) {
    this.url = GLOBAL.url;
  }

  //Crear una venta
  createVenta(venta:Venta):Observable<Venta>{
    return this.http.post<Venta>(this.url+'/ventas',venta);

  }
}
