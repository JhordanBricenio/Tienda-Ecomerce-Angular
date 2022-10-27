import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
  public btn_load = false;
  public carrito_load = true;
  promociones:any=undefined;
  public cupon: string = "";
  public error_cupon='';
  public descuentoc = 0;


  public user:any = {};
  descuento:number;
  public errors=[];

  //Culqui
  public card_data: any = {};


  //Venta
  public venta: Venta = new Venta();



  constructor(private clienteService: ClienteService,
    private authService: AuthService,
    private ventaService: VentaService,
    private route:Router) {
    this.venta.cliente = this.authService.usuario;

    
    this.clienteService.getEnvios().subscribe(
      response => {
        this.envios = response;
        
      }
    );

    
    this.user=JSON.parse(localStorage.getItem('usuario'));
   

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
            description: 'Pago en T&MTactical',
            amount: {
              currency_code: 'USD',
              value: this.totalPagar
            },
          }]
        });

      },
      onApprove: async (data, actions) => {

        const order = await actions.order.capture();
        this.venta.transaccion = order.purchase_units[0].payments.captures[0].id;
        this.ventaService.createVenta(this.venta).subscribe(
          response => {
            this.route.navigate(['/cuenta/ordenes']);
            console.log(response);
          }
        );

      },
      onError: err => {

      },
      onCancel: function (data, actions) {

      }
    }).render(this.paypalElement.nativeElement);
    this.clienteService.getPromocion().subscribe(response => {
      if (response != null) {
        this.promociones = response;        
      } else {
        console.log("No hay promocion");
      }
    }
    );

  }
  init_data(){
    this.clienteService.getCarrito(this.authService.usuario.id).subscribe(
      response => {
        this.carritos = response;
        this.carritos.forEach(element => {
          let dventa= new Dventa();

          dventa.subtotal = element.producto.precio;
          dventa.cantidad = element.cantidad;
          dventa.producto = element.producto;
          dventa.talla = element.talla;
          this.venta.dventas.push(dventa);
          console.log(dventa);
          
        });
        this.carrito_load = false;
       this.getTotalCarrito();
       this.calcularTotal("Envio gratis");
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
          message: 'Se eliminó el producto del carrito',
        });
        this.clienteService.getCarrito(this.authService.usuario.id).subscribe(
          response => {
            this.carritos = response;
            this.getTotalCarrito();
          }
        );
      });
      //ACtualizar carrito
      
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
    this.venta.subtotal = this.totalPagar;
    this.venta.envio_precio = parseInt(this.precioEnvio);
    this.venta.envio_titulo = envio_titulo;
    // console.log(this.venta);
  }

  //Culqui
  getTokenCulqui() {

    let month, year;

    let exp_array = this.card_data.exp.split('/');

    let data = {
      "card_number": this.card_data.ncard.toString().replace(/ /g, '').substring(0, 16),
      "cvv": this.card_data.cvc,
      "expiration_month": exp_array[0],
      "expiration_year": exp_array[1].substring(0, 2),
      "email": this.user.email,

    }
    this.clienteService.getTokenCulqui(data).subscribe(
      response => {
        let charge={
          "amount": this.totalPagar+"00",
          "currency_code": "PEN",
          "email": this.user.email,
          "source_id": response.id
        }
        this.clienteService.getChargeCulqui(charge).subscribe(
          response=>{
            this.venta.transaccion = response.id;
            this.ventaService.createVenta(this.venta).subscribe(
              response => {
                console.log(response);
                this.btn_load = false;
                this.route.navigate(['/cuenta/ordenes']);
              }
            );
           
          });
      });

  }

  //Alicar cupon
  validar_cupon() {
    if(this.cupon){
      if(this.cupon.toString().length<=25){
        
        this.clienteService.getCupon(this.cupon).subscribe(response => {
            this.error_cupon='';
            if(response.tipo=='Valor Fijo'){
              this.descuentoc = response.valor;
              this.totalPagar = this.totalPagar - this.descuentoc;
              this.cupon='';
            }else if(response.tipo=='Porcentaje'){
              this.descuentoc = (this.totalPagar * response.valor) / 100;
              this.totalPagar = Math.round(this.totalPagar - this.descuentoc);
              this.cupon='';
            }     

        
        }, error => {
          this.error_cupon = error.error.mensaje;          
          });

      }
      else{
       this.error_cupon='El cupon debe ser menos de 30 caracteres';
      }
    }else{
      this.error_cupon='El cupon no es valido';
    }
  }
}
