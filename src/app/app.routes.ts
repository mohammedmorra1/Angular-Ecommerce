import { Routes } from '@angular/router';
import { authGuard } from './Guard/auth-guard';

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
        path: '**',
        redirectTo: 'home'
    }
];
