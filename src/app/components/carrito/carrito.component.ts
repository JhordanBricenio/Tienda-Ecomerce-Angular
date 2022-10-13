import { Component, OnInit } from '@angular/core';
import { Carrito } from 'src/app/models/carrito';
import { Cliente } from 'src/app/models/cliente';
import { AuthService } from 'src/app/sercices/auth.service';
import { ClienteService } from 'src/app/sercices/cliente.service';

declare var iziToast: any;
declare var Cleave;
declare var StickySidebar;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carritos: Carrito[] = [];
  public cliente: Cliente = new Cliente();

  public subTotal = 0;

  public direccion_principal: any = {
  };
  public envios:Array<any> = [];

  constructor(private clienteService: ClienteService,
    private authService: AuthService)
     { 
      this.clienteService.getEnvios().subscribe(
        response => {
          this.envios = response;
        }
      );


    }

  ngOnInit(): void {
    this.getCarrito(this.authService.usuario.id);

    setTimeout(() => {
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
          // update UI ...
        }
      });
      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
    });
    new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });
    this.getDireccionPrincipal(this.authService.usuario.id);
  }

  //Obtener carrito por id de cliente
  getCarrito(id: number) {
    this.clienteService.getCarrito(id).subscribe(
      response => {
        this.carritos = response;
        this.getTotalCarrito();
      }
    );
  }


  //calcular total de carrito
  getTotalCarrito() {

    this.carritos.forEach(element => {
      this.subTotal = this.subTotal + (element.precio * element.cantidad);
    });
  }

  eliminarCarrito(id) {
    this.clienteService.delete(id).subscribe(
      response => {
        iziToast.show({
          title: 'success',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto del carrito'
        });
        // this.getCarrito(5);
      }
    );
  }

  //Obtener direccion principal del cliente
  getDireccionPrincipal(id: number) {
    this.clienteService.getDireccionesEnvioPrincipal(id).subscribe(
      response => {
        this.direccion_principal = response;
      }
    );
  }

}
