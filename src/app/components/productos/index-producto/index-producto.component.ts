import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Categoria } from 'src/app/models/categoria';
import { Product } from 'src/app/models/producto';
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

  public pagination: any;

  constructor(private productoService: ProductoService, 
    private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe((params) => {
      let page: number = 0;
      if (!page) {
        page = 0;
      }
      this.productoService
        .getProducts(page)
        .pipe(
          tap((response) => {
            (response.content as Product[]).forEach((product) => {
              console.log(product.titulo);
            });
          })
        )
        .subscribe((response) => {
          this.productos = response.content as Product[];
          this.pagination = response;
        });
    });
    this.productoService.getCategorias().subscribe(
      response =>{
        this.categorias=response;
      }
    );
  }

}