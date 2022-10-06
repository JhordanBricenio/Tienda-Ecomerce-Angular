import { Component, OnInit } from '@angular/core';
import { Carrito } from 'src/app/models/carrito';
import { Categoria } from 'src/app/models/categoria';
import { ClienteService } from 'src/app/sercices/cliente.service';
import { ProductoService } from 'src/app/sercices/producto.service';

declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  public op_cart: boolean = false;
  categorias: Categoria[] = [];
  carritos: Carrito[] = [];

  public subTotal = 0;

  constructor(private productoService: ProductoService,
    private clienteService: ClienteService) { }

  ngOnInit(): void {

    this.productoService.getCategorias().subscribe(
      response => {
        this.categorias = response;
      }
    );

    //Obtener carrito por id de cliente
    this.getCarrito(5);

  }

  opModalCart() {
    if (this.op_cart == false) {
      this.op_cart = true;
      $('#cart').addClass('show');
    } else {
      this.op_cart = false;
      $('#cart').removeClass('show');
    }

  }
  //Obtener carrito por id de cliente
  getCarrito(id: number) {
    this.clienteService.getCarrito(id).subscribe(
      response => {
        console.log(response);
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
          message:'Se eliminó el producto del carrito'
        });
        console.log(response);
       // this.getCarrito(5);
      }
    );
  }

}
