import { Venta } from "./venta";

export class Cliente {
    id: number;
    nombres: string;
    apellidos: string;
    email: string;
    pais: string;
    password: string;
    perfil: string;
    telefono: string;
    fechaNac: Date;
    genero: string;
    dni: number;
    enabled: boolean;
    username: string;
    roles: string[]= [];
    venta: Venta[] = [];
}
