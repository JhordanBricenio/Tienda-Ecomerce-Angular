import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { AuthService } from 'src/app/sercices/auth.service';

declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  cliente: Cliente;

  constructor(private authService: AuthService, private router: Router) { 
    this.cliente = new Cliente();
  }

  ngOnInit(): void {
    if(this.authService.isAuntenitcated()){
      iziToast.info({
        title: 'Info',
        message: 'Ya estás autenticado',
      });
      this.router.navigate(['/']);
    }
  }

  login():void{
    //console.log(this.cliente);
    if(this.cliente.email == null || this.cliente.password == null){
      iziToast.error({
        title: 'Error',
        message: 'Los campos email y password son obligatorios',
      });
      return;
    }
    this.authService.login(this.cliente).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      //guargar id de usuario auntenticado
      
      let cliente = this.authService.usuario;
      localStorage.setItem('_id',cliente.id.toString());
      this.router.navigate(['/']);
      iziToast.success({
        title: 'OK',
        message: `Hola ${cliente.nombres}, has iniciado sesión con éxito`,
      });
    }, err => {
      if(err.status == 400){
        iziToast.error({
          title: 'Error',
          message: 'Usuario o clave incorrecta',
          });
      }
    });
  }
}
