import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente';
import { Direcion } from 'src/app/models/direcion';
import { AuthService } from 'src/app/sercices/auth.service';
import { ClienteService } from 'src/app/sercices/cliente.service';
import { ProductoService } from 'src/app/sercices/producto.service';

declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-direciones',
  templateUrl: './direciones.component.html',
  styleUrls: ['./direciones.component.css']
})
export class DirecionesComponent implements OnInit {


  public direcion: Direcion = new Direcion();
  public direciones: Direcion[] = [];
  public cliente: Cliente = new Cliente();
  public token;

  public regiones: Array<any> = [];
  public provincias: Array<any> = [];
  public distritos: Array<any> = [];

  public regiones_Arr: Array<any> = [];
  public provincias_Arr: Array<any> = [];
  public distritos_Arr: Array<any> = [];


  public load_data=true;

  constructor(private productoService: ProductoService, private authService: AuthService,
    private clienteService: ClienteService) {

    this.token = localStorage.getItem('token');

    this.productoService.getRegiones().subscribe(
      response => {
        this.regiones_Arr = response;
      }
    );
    this.productoService.getProvincias().subscribe(
      response => {
        this.provincias_Arr = response;
      }
    );
    this.productoService.getDistritos().subscribe(
      response => {
        this.distritos_Arr = response;
      }
    );


  }

  ngOnInit(): void {
    this.clienteService.getCliente(this.authService.usuario.id).subscribe(
      response => {
        this.cliente = response;
      }
    );
    this.getDireciones();
  }
  createDirecion() {
    this.regiones_Arr.forEach(element => {
      if (parseInt(element.id) == parseInt(this.direcion.region)) {
        this.direcion.region = element.name;
      }
    });
    this.provincias_Arr.forEach(element => {
      if (parseInt(element.id) == parseInt(this.direcion.provincia)) {
        this.direcion.provincia = element.name;
      }
    });
    this.distritos_Arr.forEach(element => {
      if (parseInt(element.id) == parseInt(this.direcion.distrito)) {
        this.direcion.distrito = element.name;
      }
    });

    this.direcion.cliente = this.cliente;
    //console.log(this.direcion);
    this.clienteService.agregarDireccionesEnvio(this.direcion).subscribe(
       response => {
         iziToast.show({
          title: 'Éxito',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se agrego la direcion de envio correctamente',
        });
        this.direcion = new Direcion();
       }
     );
  }

  getDireciones() {
    this.clienteService.getDireccionesEnvio(this.authService.usuario.id).subscribe(
      response => {
        this.direciones = response;
        this.load_data=false;
      }
    );
  }

  selectPais() {
    if (this.direcion.pais == 'Perú') {
      $('#sl_region').prop('disabled', false);
      this.productoService.getRegiones().subscribe(
        response => {
          response.forEach(element => {
            this.regiones.push(
              {
                id: element.id,
                nombre: element.name
              });
          });

        }
      );

    }
    else {
      $('#sl_region').prop('disabled', true);
      $('#sl_provincia').prop('disabled', true);
      this.regiones = [];
      this.provincias = [];

      this.direcion.region = null;
      this.direcion.provincia = null;

    }
  }
  selectRegion() {
    this.provincias = [];
    $('#sl_provincia').prop('disabled', false);
    $('#sl_distrito').prop('disabled', true);
    this.direcion.provincia = null;
    this.direcion.distrito = null;
    this.productoService.getProvincias().subscribe(
      response => {
        response.forEach(element => {
          if (element.department_id == this.direcion.region) {
            this.provincias.push(element);
          }
        });
      });
    console.log(this.provincias);

  }

  select_provincia() {
    this.distritos = [];
    $('#sl_distrito').prop('disabled', false);
    this.direcion.distrito = null;
    this.productoService.getDistritos().subscribe(
      response => {
        response.forEach(element => {
          if (element.province_id == this.direcion.provincia) {
            this.distritos.push(element);
          }
        });
      });
    console.log(this.distritos);
  }



}
