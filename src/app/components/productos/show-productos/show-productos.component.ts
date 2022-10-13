import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Carrito } from 'src/app/models/carrito';
import { Cliente } from 'src/app/models/cliente';
import { Product } from 'src/app/models/producto';
import { CategoriaService } from 'src/app/sercices/categoria.service';
import { ClienteService } from 'src/app/sercices/cliente.service';
import { ProductoService } from 'src/app/sercices/producto.service';
import { AuthService } from 'src/app/sercices/auth.service';

declare var tns;
declare var lightGallery: any;
declare var iziToast: any;

@Component({
  selector: 'app-show-productos',
  templateUrl: './show-productos.component.html',
  styleUrls: ['./show-productos.component.css'],
})
export class ShowProductosComponent implements OnInit {
  public producto: Product;
  public carrito: Carrito = new Carrito();
  public cliente:Cliente= new Cliente();

  public productos: Product[] = [];
  public slug;

  public btn_cart=false;

  constructor(
    private productoService: ProductoService,
    private activateRoute: ActivatedRoute,
    private categoriaService: CategoriaService,
    private clienteService: ClienteService,
    private authService: AuthService
  ) {
    this.activateRoute.params.subscribe((params) => {
      this.slug = params['slug'];
      this.productoService.getProductsSlug(this.slug).subscribe((response) => {
        this.producto = response;
        this.categoriaService.getProductosPorCategoria(this.producto.categoria.id).subscribe(
          respuesta => {
            this.productos = respuesta;
          }
        );

      });


    });
  }

  ngOnInit(): void {
    this.clienteService.getCliente(this.authService.usuario.id).subscribe(  
      response => {
        this.cliente = response;
        this.carrito.cliente = this.cliente;
      }
    );


    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        navPosition: 'top',
        controlsPosition: 'top',
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: '#cs-thumbnails',
        navAsThumbnails: true,
        gutter: 15,
      });
      var e = document.querySelectorAll('.cs-gallery');
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], {
            selector: '.cs-gallery-item',
            download: !1,
            videojs: !0,
            youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 },
            vimeoPlayerParams: { byline: 0, portrait: 0 },
          });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        navPosition: 'top',
        controlsPosition: 'top',
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: '#custom-controls-related',
        responsive: {
          0: {
            items: 1,
            gutter: 20,
          },
          480: {
            items: 2,
            gutter: 24,
          },
          700: {
            items: 3,
            gutter: 24,
          },
          1100: {
            items: 4,
            gutter: 30,
          },
        },
      });



    }, 500);

  }

  agregarCarrito() {
    //Crear cliente para prubeas

    //Validar la variedad del producto 
    if (this.carrito.cantidad <= this.producto.stock) {
      this.carrito.producto = this.producto;
      this.carrito.cliente = this.cliente;
      this.carrito.precio = this.producto.precio;
      this.carrito.cantidad = this.carrito.cantidad;
      this.btn_cart=true;

      this.clienteService.agregarCarrito(this.carrito).subscribe(
        response => {
          console.log(response);
          iziToast.show({
            title: 'success',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agrego el producto al carrito',
          });
        }
      );
      this.btn_cart=false;

    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF5B5C',
        color: '#FFF',
        class: 'text-success',
        position: 'topRight',
        message: 'La maxima cantidad disponible es ' + this.producto.stock,
      });
    }

  }
}
