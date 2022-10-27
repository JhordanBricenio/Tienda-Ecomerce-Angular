import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxStarRatingComponent } from 'ngx-star-rating';
import { Venta } from 'src/app/models/venta';
import { ClienteService } from 'src/app/sercices/cliente.service';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css']
})
export class DetalleOrdenComponent implements OnInit {


  public detalles: Venta = new Venta();
  public load_data = true;
  public id;
  public totalStar=5;

  constructor(private clienteService: ClienteService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.clienteService.getOrdenCompra(this.id).subscribe(
      response => {
        this.detalles = response;
       
        this.load_data = false;
      });
  }
  onRate($event:{oldValue:number, newValue:number, starRating:NgxStarRatingComponent}) {
    console.log(`Old Value:${$event.oldValue}
    New Value: ${$event.newValue}
    `);
  }


  
  }
  
