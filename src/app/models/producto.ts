import { Categoria } from "./categoria";
import { Marca } from "./marca";

export class Product {
    id:number;
    slug:string;
    titulo:string;
    precio:number;
    descripcion:string;
    contenido:string;
    stock:number;
    nventas:number;
    npuntos:number;
    estado:string;
    create_at:Date;
    imagen:string;
    categoria:Categoria;
    marca:Marca;
}
