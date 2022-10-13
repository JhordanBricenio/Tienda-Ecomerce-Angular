import { Routes, RouterModule } from "@angular/router";
import { ModuleWithProviders } from "@angular/core";
import { InicioComponent } from "./components/inicio/inicio.component";
import { IndexProductoComponent } from "./components/productos/index-producto/index-producto.component";
import { ShowProductosComponent } from "./components/productos/show-productos/show-productos.component";
import { CarritoComponent } from "./components/carrito/carrito.component";
import { LoginComponent } from "./components/login/login.component";
import { PerfilComponent } from "./components/usuario/perfil/perfil.component";
import { DirecionesComponent } from "./components/usuario/direciones/direciones.component";

const appRoute:Routes=[
    {path:'', component:InicioComponent},
    {path:'login', component:LoginComponent},
    {path:'cuenta/perfil', component:PerfilComponent},
    {path:'cuenta/direciones', component:DirecionesComponent},

    {path:'productos', component:IndexProductoComponent},
    {path:'productos/page/:page', component:IndexProductoComponent},
    {path:'productos/:slug', component:ShowProductosComponent},
    {path:'productos/categorias/:id', component:IndexProductoComponent},
    {path:'productos/categorias/:id', component:ShowProductosComponent},

    {path:'carrito', component:CarritoComponent},

]
export const appRoutingProviders:any[]=[];
export const routing:ModuleWithProviders<any>= RouterModule.forRoot(appRoute);