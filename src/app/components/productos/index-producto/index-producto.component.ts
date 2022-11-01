import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';
import { Carrito } from 'src/app/models/carrito';
import { Categoria } from 'src/app/models/categoria';
import { Cliente } from 'src/app/models/cliente';
import { Product } from 'src/app/models/producto';
import { Promocion } from 'src/app/models/promocion';
import { AuthService } from 'src/app/sercices/auth.service';
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
  public promociones:Promocion[]=[];

  public pagination: any;
  public btn_cart:boolean=false;
  public filter_cat_productos='todos';
  public filtro:string='';
  public totalProductos:number=0;

  constructor(public productoService: ProductoService,
    private categoriaService:CategoriaService, 
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private authService:AuthService,
    private router:Router) { }

  ngOnInit(): void {
    this.clienteService.getCliente(this.authService.usuario.id).subscribe(  
      response => {
        this.cliente = response;
        this.carrito.cliente = this.cliente;
      }
    );

    this.productoService.countProducts().subscribe(
      response=>{
        this.totalProductos=response;
        
        return this.totalProductos;
       
        
      }
    );
   
        
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
      this.productoService.geProductsBySearch(page).subscribe((response) => {
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
        console.log(this.categorias);
        
      });
    this.clienteService.getPromocion().subscribe(response=>
      {
        if(response!=null){
        this.promociones=response ;
        
        }else{
          console.log("No hay promocion");
        }
      }
    );

    //Contar productos por categoria
    //Damas==1
    //Casacas==2
    //zapatos==3
    


   

   
      
    }

  

  filtrar() {
    if (this.filtro != null) {
      console.log(this.filtro);
      
      this.productoService.geProductsBySearch(0,this.filtro).subscribe((response) => {
        this.productos = response.products as Product[];        
      }
      );
      
    } 
    }
  reset(){
    this.filtro = null;
    this.ngOnInit();
  }

  filtrarPorCategoria(){
    if(this.filter_cat_productos=='todos'){
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

    }else{
      this.categoriaService.getProductosPorCategoria(this.filter_cat_productos).subscribe(
        response=>{
          this.productos=response;
          console.log(this.productos);
          
        }
      );
    }
    
    
  }

  //contar cantidda de productos por categoria
  contarProductosPorCategoria(id:number){
    this.productoService.countProductsByCategory(id).subscribe(
      response=>{
        console.log(response);
        return response;
        
        
      }
    );
  }

  agregarCarrito(producto:Product) {
    //Crear cliente para prubeas
    //validar pendiente

      this.carrito.producto = producto;
      this.carrito.cliente = this.cliente;
      this.carrito.precio = producto.precio;
      this.carrito.cantidad =1;
     /* this.carrito.talla=
      producto.variedades.forEach(element => {
        return element[0].variedades;
      });*/
      this.btn_cart=true;

      this.clienteService.agregarCarrito(this.carrito).subscribe(
        response => {
         // console.log(response);
          iziToast.show({
            title: 'success',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agrego el producto al carrito',
          });

          //
          this.router.navigate(['/']);
        }
      );
      this.btn_cart=false;
  }

}