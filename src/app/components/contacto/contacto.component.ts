import { Component, OnInit } from '@angular/core';
import { Contacto } from 'src/app/models/contacto';
import { ClienteService } from 'src/app/sercices/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  public contacto:Contacto= new Contacto();

  constructor(private clienteService: ClienteService) { }

  ngOnInit(): void {
  }

  create(){
    this.clienteService.createContacto(this.contacto).subscribe(
      response => {
        console.log(response);
        iziToast.show({
          title: 'OK',
          titleColor: '#1DC74C',
          class: 'text-success',
          position: 'topRight',
          color: '#fff',
          message: 'Mensaje enviado correctamente',
        });
        this.contacto = new Contacto();
      }
    )
  }

}
