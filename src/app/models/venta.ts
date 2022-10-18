import { Cliente } from "./cliente";
import { Direcion } from "./direcion";
import { Dventa } from "./dventa";

export class Venta {
    id: number;
    nventa:string;
    subtotal: number;
    envio_titulo: string;
    envio_precio: number;
    transaccion: string;
    estado: string;
    nota: string;
    fecha: Date;
    direccion:Direcion
    dventas: Dventa[] = [];
    cliente: Cliente;

}
