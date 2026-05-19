import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Signup } from './Components/signup/signup';
import { ForgetPassword } from './Components/forget-password/forget-password';
import { PinForm } from './Components/pin-form/pin-form';
import { ResetPassword } from './Components/reset-password/reset-password';
import { authGuard } from './Guard/auth/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./core/features/products/components/home/home').then(m => m.Home)
    },
    {
        path: 'shop',
        loadComponent: () => import('./core/features/products/components/shop/shop').then(m => m.Shop)
    },
    {
        path: 'login',
        loadComponent: () => import('./Components/login/login').then(m => m.Login)
    },
    {
        path: 'signup',
        loadComponent: () => import('./Components/signup/signup').then(m => m.Signup)
    },
    {
        path:'signup',
        component: Signup
    },
    {
        path:'forgetpassword',
        component: ForgetPassword
    },
    {
        path:'pinform',
        component: PinForm
    },
    {
        path:'resetpassword',
        component:ResetPassword
    }
];
