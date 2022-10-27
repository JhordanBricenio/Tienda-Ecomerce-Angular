import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from 'src/app/models/carrito';
import { Categoria } from 'src/app/models/categoria';
import { Promocion } from 'src/app/models/promocion';
import { AuthService } from 'src/app/sercices/auth.service';
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
  promociones:any=undefined;
  descuento:number;

  public subTotal;
  public promo=0;

  constructor(private productoService: ProductoService,
    private clienteService: ClienteService,
    public authServcice: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    this.productoService.getCategorias().subscribe(
      response => {
        this.categorias = response;
      }
    );

    this.getCarrito(this.authServcice.usuario.id);

  }
  logout(): void {
    let username = this.authServcice.usuario.nombres;
    this.authServcice.logout();
    iziToast.show({
      title: 'Adios',
      message: 'Hasta pronto ' + username,
      color: 'red',
      position: 'topRight'
    });
    this.router.navigate(['/login']);
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

        this.carritos = response;
        this.getTotalCarrito();
      }
    );
  }
  //calcular total de carrito
  getTotalCarrito() {
    this.clienteService.getPromocion().subscribe(response => {
      if (response != null) {
        this.promociones = response;
        this.promociones.forEach(element => {
          sessionStorage.setItem('descuento', JSON.stringify(element.descuento));
        })
       
               
      } else {
        console.log("No hay promocion");
      }
    });
    
    this.subTotal = 0;
    this.descuento = JSON.parse(sessionStorage.getItem('descuento'));

     
    if (this.descuento==null) {
      this.carritos.forEach(element => {
        this.subTotal = this.subTotal + (element.producto.precio* element.cantidad);        
        
      });
    } else if (this.descuento!=null) {
      this.carritos.forEach(element => {

        let new_precio = element.producto.precio - (element.producto.precio * this.descuento) / 100;
        this.subTotal = this.subTotal + new_precio;
        //console.log(this.subTotal);
        
      });
    }

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


}
