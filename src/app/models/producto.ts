import { Categoria } from "./categoria";
import { Imagen } from "./imagen";
import { Marca } from "./marca";
import { Variedad } from "./variedad";

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
    variedades:Variedad[]= [];
    imagenes:Imagen[];
}
