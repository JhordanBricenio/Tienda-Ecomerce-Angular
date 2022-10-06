import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Carrito } from 'src/app/models/carrito';
import { Categoria } from 'src/app/models/categoria';
import { Cliente } from 'src/app/models/cliente';
import { Product } from 'src/app/models/producto';
import { CategoriaService } from 'src/app/sercices/categoria.service';
import { ClienteService } from 'src/app/sercices/cliente.service';
import { ProductoService } from 'src/app/sercices/producto.service';
declare var noUiSlider: any;
declare var $: any;
declare var iziToast:any;


@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {
  public productos: Product[] = [];
  categorias:Categoria[]=[];
  producto:Product[]=[];
  public carrito: Carrito = new Carrito();
  public cliente:Cliente= new Cliente();

  public pagination: any;
  public btn_cart:boolean=false;

  constructor(private productoService: ProductoService,
    private categoriaService:CategoriaService, 
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    //Crear clienre para pruebas
        //Crear clienre para pruebas
        this.cliente.id = 5;
        this.cliente.nombres = 'Juan';
        this.cliente.apellidos = 'Perez';
        this.cliente.email = 'juan perez';
        this.cliente.pais = 'Peru';
        this.cliente.password = '123456';
        this.cliente.perfil = 'cliente';
        this.cliente.telefono = '123456';
        this.cliente.fechaNac = new Date();
        this.cliente.genero = 'Masculino';
        this.cliente.dni = 123456;


        
    this.activateRoute.paramMap.subscribe((params) => {
      let page: number =+params.get('page');
      let categoria:number=+params.get('id');
      this.categoriaService.getProductosPorCategoria(categoria).subscribe(
        respuesta=>{
          this.producto=respuesta;
          //console.log(this.producto);
        }
      );

      if (!page) {
        page = 0;
      }
      this.productoService.getProducts(page).subscribe((response) => {
        if(categoria){
          this.productos = this.producto;
          this.pagination = this.producto;
        }else{
          this.productos = response.content as Product[];
          this.pagination = response;
        }
        });
    });

    this.productoService.getCategorias().subscribe(
      response =>{
        this.categorias=response;
      }
    );
  }
  filtrarPorCategoria(){
    
  }

  agregarCarrito(producto:Product) {
    //Crear cliente para prubeas
    //validar pendiente

      this.carrito.producto = producto;
      this.carrito.cliente = this.cliente;
      this.carrito.precio = producto.precio;
      this.carrito.cantidad =1;
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
  }

}