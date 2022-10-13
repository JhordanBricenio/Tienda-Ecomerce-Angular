import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario:Cliente;
  private _token:string;

  constructor(private http:HttpClient) { }

  public get usuario():Cliente{ 
    if(this._usuario != null){
      return this._usuario;
    }
    else if(this._usuario == null && localStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(localStorage.getItem('usuario')) as Cliente;
      return this._usuario;
    }
    return new Cliente();
  }
  public get token():string{
    if(this._token != null){
      return this._token;
    }
    else if(this._token == null && localStorage.getItem('token') != null){
      this._token = localStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  login(usuario:Cliente):Observable<any>{
    const urlEndPoint = 'http://localhost:9090/oauth/token';
    const credenciales = btoa('angularapp' + ':' + '12345'); //angularapp:12345
    const httpHeaders = new HttpHeaders({'Content-Type': 'application/x-www-form-urlencoded',
     'Authorization': 'Basic ' + credenciales});
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.email);
    params.set('password', usuario.password);
    console.log(params.toString());
    return this.http.post<any>(urlEndPoint,params.toString() ,{headers:httpHeaders});
  }
  guardarUsuario(accessToken:string):void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario= new Cliente();
    this._usuario.id = payload.id;
    this._usuario.nombres = payload.name;
    this._usuario.apellidos = payload.lastName;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    localStorage.setItem('usuario', JSON.stringify(this._usuario));
  }
  guardarToken(accessToken:string):void{
    this._token = accessToken;
    localStorage.setItem('token', accessToken);

  }

  obtenerDatosToken(accessToken:string):any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }
  isAuntenitcated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }
  logout():void{
    this._token = null;
    this._usuario = null;
    localStorage.clear();
  }
}
