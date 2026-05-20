import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Signup } from './Components/signup/signup';
import { authGuard } from './Guard/auth-guard';
import { Home } from './core/features/products/components/home/home';
import { Shop } from './core/features/products/components/shop/shop';
import { Checkout } from './core/features/products/components/checkout/checkout';
import {PaymentSuccess} from './core/features/products/components/payment-success/payment-success';
import { ProductDetailTest } from './core/features/products/components/product-detail-test/product-detail-test';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  {
    path: 'shop',
    component: Shop,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'signup',
    component: Signup,
  },
  {path: 'product-detail-test',component: ProductDetailTest},
  { path: 'checkout', component: Checkout },
  { path: 'payment-success', component: PaymentSuccess },
  {
    path: '**',
    redirectTo: 'home',
  },
];
