import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';
import { Product } from 'src/app/models/producto';
import { CategoriaService } from 'src/app/sercices/categoria.service';
import { ProductoService } from 'src/app/sercices/producto.service';
declare var noUiSlider: any;
declare var $: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css']
})
export class IndexProductoComponent implements OnInit {
  public productos: Product[] = [];
  categorias:Categoria[]=[];
  producto:Product[]=[];

  public pagination: any;

  constructor(private productoService: ProductoService,
    private categoriaService:CategoriaService, 
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      let page: number =+params.get('page');
      let categoria:number=+params.get('id');
      this.categoriaService.getProductosPorCategoria(categoria).subscribe(
        respuesta=>{
          this.producto=respuesta;
          console.log(this.producto);
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

}