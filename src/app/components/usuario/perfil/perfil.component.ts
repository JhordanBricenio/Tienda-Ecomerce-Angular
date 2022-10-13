import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { AuthService } from 'src/app/sercices/auth.service';
import { ClienteService } from 'src/app/sercices/cliente.service';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  public errors: string[];

  constructor(private clienteService:ClienteService, private router:Router,
    public authService:AuthService) { }

  ngOnInit(): void {
    this.clienteService.getCliente(this.authService.usuario.id).subscribe(
      cliente => this.cliente = cliente
    )
  }
  //Actualizar perfil del cliente
  actualizar(){
    console.log(this.cliente);
    this.cliente.password = $('#input_password').val();
    this.clienteService.update(this.cliente)
      .subscribe(
        json => {
         // this.router.navigate(['/']);
          iziToast.success({
            title: 'Perfil Actualizado',
            message: `${json.mensaje}: ${json.cliente.nombres}`,
          });
        },
        err => {
          this.errors = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
        })
  }

}
