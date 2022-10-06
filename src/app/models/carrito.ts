import { Cliente } from "./cliente";
import { Product } from "./producto";

export class Carrito {
    id: number;
    cantidad: number;
    precio: number;
    producto: Product;
    cliente: Cliente;
}
