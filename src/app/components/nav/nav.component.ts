import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/models/categoria';
import { ProductoService } from 'src/app/sercices/producto.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  categorias:Categoria[]=[];

  constructor(private productoService: ProductoService) { }

  ngOnInit(): void {

    this.productoService.getCategorias().subscribe(
      response =>{
        this.categorias=response;
      }
    );
  }

}
