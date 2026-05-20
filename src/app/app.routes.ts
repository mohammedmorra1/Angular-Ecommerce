import { Routes } from '@angular/router';
import { authGuard } from './Guard/auth/auth-guard';

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
  {
    path: 'forgetpassword',
    loadComponent: () =>
      import('./Components/forget-password/forget-password').then((m) => m.ForgetPassword),
  },
  {
    path: 'pinform',
    loadComponent: () => import('./Components/pin-form/pin-form').then((m) => m.PinForm),
  },
  {
    path: 'resetpassword',
    loadComponent: () =>
      import('./Components/reset-password/reset-password').then((m) => m.ResetPassword),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./core/features/products/components/checkout/checkout').then((m) => m.Checkout),
    canActivate: [authGuard],
  },
  {
    path: 'payment-success',
    loadComponent: () =>
      import('./core/features/products/components/payment-success/payment-success').then(
        (m) => m.PaymentSuccess,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./core/features/products/components/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
