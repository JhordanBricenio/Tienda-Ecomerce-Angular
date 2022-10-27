import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from '../models/carrito';
import { GLOBAL } from './GLOBAL';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Cliente } from '../models/cliente';
import { AuthService } from './auth.service';
import { Direcion } from '../models/direcion';
import { Contacto } from '../models/contacto';


declare var iziToast: any;


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public url;
  private httheaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {
    this.url = GLOBAL.url;
  }
  private agregarAuthorizationHeader() {
    let token = this.authService.token;
    if (token != null) {
      return this.httheaders.append('Authorization', 'Bearer ' + token);
    }
    return this.httheaders;
  }

  private isNoAutorizado(e): boolean{
    if( e.status == 401 || e.status == 403){
      this.router.navigate(['/login']);
      return true;
    }
    return false;
  }

  //Registar cliente
  create(cliente: Cliente) {
    return this.http
      .post(this.url + '/clientes', cliente, { headers: this.agregarAuthorizationHeader() })
      .pipe(
        map((response: any) => response.cliente as Cliente),
        catchError((e) => {
          if (e.status == 400) {
            return throwError(() => e);
          }
          console.log(e.error.mensaje);
          iziToast.show({
            title: 'Error',
            titleColor: '#FF0000',
            class: 'text-danger',
            position: 'topRight',
            message: `${e.error.mensaje}`
          });
          // swal.fire(e.error.mensaje, e.error.error, 'error');
          return throwError(() => e);
        })
      );

  }


  agregarCarrito(carrito:Carrito) : Observable<Carrito>{
    return this.http.post<Carrito>(this.url + '/carrito', carrito, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(() => e);
        }
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
  //Actualizar perfil del cliente
  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.url+'/clientes'}/${cliente.id}`, cliente, { headers: this.httheaders }).pipe(
      catchError(e => {

        if (e.status == 400) {
          return throwError(() => e);
        }

        console.error(e.error.mensaje);
        console.error(e.error.error);
        iziToast.error({
          title: 'Error',
          message: e.error.mensaje
        });
        return throwError(() => e);
      })
    );
  }

  //Obtener cliente por id
  getCliente(id): Observable<Cliente> {

    return this.http.get<Cliente>(`${this.url+'/clientes'}/${id}`).pipe(
      catchError(e => {

        if (this.isNoAutorizado(e)) {
          return throwError(() => e);
        }

        //console.error(e.error.mensaje);
        //console.error(e.error.error);
        iziToast.error({
          title: 'Error',
          message: e.error.mensaje
        });
        return throwError(() => e);
      })
    );
  }

  //Registrar direcciones de envio
  agregarDireccionesEnvio(direcion:Direcion) : Observable<Direcion>{
    return this.http.post<Direcion>(this.url + '/direcciones', direcion, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(() => e);
        }
        iziToast.error({
          title: 'Error',
          message: e.error.mensaje,
        });
        return throwError(() => e);
      })

    );
  }

  //Cambia el estado de la direccion de envio
  cambiarEstadoDireccionEnvio(id:number, idCliente:number) : Observable<Direcion>{
    return this.http.put<Direcion>(this.url + '/direcciones/'+id+'/'+idCliente, { headers: this.agregarAuthorizationHeader() }).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(() => e);
        }
        iziToast.error({
          title: 'Error',
          message: e.error.mensaje,
        });
        return throwError(() => e);
      })

    );
  }

  //LIstar direcciones de envio
  getDireccionesEnvio(id): Observable<any>{
    return this.http.get(`${this.url+'/direcciones'}/${id}`);
  }

  //Obtener direccion de envio principal
  getDireccionesEnvioPrincipal(id): Observable<any>{
    return this.http.get(`${this.url+'/direccion/cliente'}/${id}`);
  }

  getEnvios(): Observable<any> {
    return this.http.get('./assets/envios.json');
  }

  //token culqui
  getTokenCulqui(data): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers= headers.append('Authorization','Bearer pk_test_3ab3f887be2b4fcd');    
    return this.http.post('https://secure.culqi.com/v2/tokens', data, { headers: headers });
  }

  //Generar cargo
  getChargeCulqui(data): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers= headers.append('Authorization','Bearer sk_test_4dbbae7b6d45e274');    
    return this.http.post('https://api.culqi.com/v2/charges', data, { headers: headers });
  }

  //Crear contacto
  createContacto(contacto: Contacto) {
    return this.http.post(this.url + '/contacto', contacto, {
      headers: this.httheaders,
    });
  }

  //Obtener ordenes de compra
  getOrdenesCompra(id): Observable<any>{
    return this.http.get(`${this.url+'/ventas'}/${id}`);
  }

  //Obtener orden de compra
  getOrdenCompra(id): Observable<any>{
    return this.http.get(`${this.url+'/ventas/detalle'}/${id}`);
  }

  //Obtener promocion activa
  getPromocion(): Observable<any>{
    return this.http.get(`${this.url+'/promocion/activa'}`);
  }

  //Obtener cupon 
  getCupon(codigo:string): Observable<any>{
    return this.http.get(`${this.url+'/cupones/aplicar'}/${codigo}`).pipe(
      catchError(e => {
       // console.log(e.error.mensaje);
        return throwError(() => e);
      })
    );;
  }


}
