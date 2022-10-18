import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Carrito } from 'src/app/models/carrito';
import { Cliente } from 'src/app/models/cliente';
import { Dventa } from 'src/app/models/dventa';
import { Venta } from 'src/app/models/venta';
import { AuthService } from 'src/app/sercices/auth.service';
import { ClienteService } from 'src/app/sercices/cliente.service';
import { VentaService } from 'src/app/sercices/venta.service';

declare var iziToast: any;
declare var Cleave;
declare var StickySidebar;

declare var paypal;

interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  @ViewChild('paypalButton', { static: true }) paypalElement: ElementRef;

  carritos: Carrito[] = [];
  public cliente: Cliente = new Cliente();

  public subTotal = 0;
  public totalPagar: any = 0;
  public direccion_principal: any = {};
  public envios: Array<any> = [];
  public precioEnvio = "0";
  public envio_titulo: string = "";


  //Venta
  public venta: Venta = new Venta();
  public dventa: Dventa = new Dventa();


  constructor(private clienteService: ClienteService,
    private authService: AuthService,
    private ventaService: VentaService) {
    this.venta.cliente = this.authService.usuario;
    this.clienteService.getEnvios().subscribe(
      response => {
        this.envios = response;
      }
    );

    this.calcularTotal("Envio gratis");

  }

  ngOnInit(): void {
    this.init_data();

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
      new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    });
    this.getDireccionPrincipal(this.authService.usuario.id);


    paypal.Buttons({
      style: {
        layout: 'horizontal'
      },
      createOrder: (data, actions) => {

        return actions.order.create({
          purchase_units: [{
            description: 'Nombre del pago',
            amount: {
              currency_code: 'USD',
              value: 999
            },
          }]
        });

      },
      onApprove: async (data, actions) => {

        const order = await actions.order.capture();
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        //Detalle de la venta
       
       //Añadir el detalle de la venta
       console.log(this.venta);
      

      this.ventaService.createVenta(this.venta).subscribe(
          response => {
            console.log(response);
          }
        );

      },
      onError: err => {

      },
      onCancel: function (data, actions) {

      }
    }).render(this.paypalElement.nativeElement);


  }
  init_data() {
    this.clienteService.getCarrito(this.authService.usuario.id).subscribe(
      response => {
        this.carritos = response;
       this.carritos.forEach(element => {
          this.dventa.subtotal = element.producto.precio;
          this.dventa.cantidad = element.cantidad;
          this.dventa.producto = element.producto;

          this.venta.dventas.push(this.dventa);
        });

        this.getTotalCarrito();
      }
    );
  }

  //calcular total de carrito
  getTotalCarrito() {

    this.carritos.forEach(element => {
      this.subTotal = this.subTotal + (element.precio * element.cantidad);
    });
    this.totalPagar = this.subTotal;
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
      }
    );
  }

  //Obtener direccion principal del cliente
  getDireccionPrincipal(id: number) {
    this.clienteService.getDireccionesEnvioPrincipal(id).subscribe(
      response => {
        this.direccion_principal = response;
        this.venta.direccion = this.direccion_principal;
      }
    );
  }

  //Calcular totaal a pagar
  calcularTotal(envio_titulo) {
    this.totalPagar = parseInt(this.subTotal.toString()) + parseInt(this.precioEnvio);
    this.venta.subtotal = this.subTotal;
    this.venta.envio_precio = parseInt(this.precioEnvio);
    this.venta.envio_titulo = envio_titulo;
    // console.log(this.venta);
  }

  //Crear venta
  createVenta() {
    console.log(this.venta);
  }


}
