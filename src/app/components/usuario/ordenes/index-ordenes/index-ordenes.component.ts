import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/sercices/cliente.service';
import { Venta } from 'src/app/models/venta';

@Component({
  selector: 'app-index-ordenes',
  templateUrl: './index-ordenes.component.html',
  styleUrls: ['./index-ordenes.component.css']
})
export class IndexOrdenesComponent implements OnInit {

  public ordenes: Array<Venta> = []
  public load_data=true;

  constructor(private clienteService:ClienteService) { }

  ngOnInit(): void {

    this.init_data();
   
  }
  init_data(){
    this.clienteService.getOrdenesCompra(localStorage.getItem('_id')).subscribe(
      response => {
        this.ordenes = response;
        this.load_data=false;
      }
    )
  }


}
