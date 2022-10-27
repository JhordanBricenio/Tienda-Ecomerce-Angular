import { Product } from "./producto";
import { Venta } from "./venta";

export class Dventa {
    id: number;
    subtotal: number;
    cantidad: number=1;
    fecha: Date;
    producto: Product;
    importe: number;
    venta_id: number;
    talla: string;

    //Calculate the subtotal
    getSubtotal(): number {
        return this.cantidad * this.producto.precio;
    }

}
