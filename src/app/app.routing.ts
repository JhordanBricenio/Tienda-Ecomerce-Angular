import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";

const appRoute:Routes=[
    {path:'', component:InicioComponent},
    {path:'productos', component:IndexProductoComponent},
    {path:'productos/page/:page', component:IndexProductoComponent},

]
export const appRoutingProviders:any[]=[];
export const routing:ModuleWithProviders<any>= RouterModule.forRoot(appRoute);