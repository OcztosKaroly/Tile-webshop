import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { 
    path: 'shop', 
    loadChildren: () => import('./pages/shop/shop.module').then(m => m.ShopModule)
  },
  { 
    path: 'cart', 
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule)
  }, 
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) 
  }, 
  { 
    path: 'register', 
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) 
  }, 
  { 
    path: 'settings', 
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
    canActivate: [AuthGuard]
  }, 
  { 
    path: 'invoices', 
    loadChildren: () => import('./pages/invoices/invoices.module').then(m => m.InvoicesModule),
    canActivate: [AuthGuard]
  }, 
  { 
    path: 'not-found', 
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) 
  },
  {
    path: '',
    redirectTo: '/shop',
    pathMatch: 'full'
  },
  { path: 'invoices', loadChildren: () => import('./pages/invoices/invoices.module').then(m => m.InvoicesModule) }, 
  {
    path: '**',
    redirectTo: '/not-found'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
