import { Component, OnInit } from '@angular/core';
import { Carrito } from 'src/app/models/carrito';
import { ClienteService } from 'src/app/sercices/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carritos:Carrito[]=[];

  public subTotal = 0;

  constructor(private clienteService:ClienteService) { }

  ngOnInit(): void {
    this.getCarrito(5);
  }

    //Obtener carrito por id de cliente
    getCarrito(id:number){
      this.clienteService.getCarrito(id).subscribe(
        response =>{
          console.log(response);
          this.carritos=response;
          this.getTotalCarrito();
        }
      );
    }


    //calcular total de carrito
    getTotalCarrito(){
     
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
            message:'Se eliminó el producto del carrito'
          });
          console.log(response);
         // this.getCarrito(5);
        }
      );
    }

}
