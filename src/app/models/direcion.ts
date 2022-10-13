import { Cliente } from "./cliente";

export class Direcion {
    id: number;
    destinatario: string;
    dni: string;
    zip: string;
    direccion: string;
    pais: string;
    region: string;
    provincia: string;
    fechaNac: Date;
    distrito: string;
    telefono: number;
    principal: boolean;
    cliente: Cliente;
}
