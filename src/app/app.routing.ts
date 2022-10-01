import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { ShowProductosComponent } from "./components/productos/show-productos/show-productos.component";

const appRoute:Routes=[
    {path:'', component:InicioComponent},
    {path:'productos', component:IndexProductoComponent},
    {path:'productos/page/:page', component:IndexProductoComponent},
    {path:'productos/:slug', component:ShowProductosComponent},
    {path:'productos/categorias/:id', component:IndexProductoComponent},
    {path:'productos/categorias/:id', component:ShowProductosComponent},

]
export const appRoutingProviders:any[]=[];
export const routing:ModuleWithProviders<any>= RouterModule.forRoot(appRoute);