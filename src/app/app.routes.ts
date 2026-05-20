import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Signup } from './Components/signup/signup';
import { Home } from './core/features/products/components/home/home';
import { Shop } from './core/features/products/components/shop/shop';
import { Checkout } from './core/features/products/components/checkout/checkout';
import {PaymentSuccess} from './core/features/products/components/payment-success/payment-success';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./core/features/products/components/home/home').then((m) => m.Home),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./core/features/products/components/shop/shop').then((m) => m.Shop),
  },
  {
    path: 'login',
    loadComponent: () => import('./Components/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('./Components/signup/signup').then((m) => m.Signup),
  },
  { path: 'checkout', component: Checkout },
  { path: 'payment-success', component: PaymentSuccess },
  {
    path: '**',
    redirectTo: 'home',
  },
];
