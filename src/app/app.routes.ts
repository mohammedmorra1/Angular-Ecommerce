import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Signup } from './Components/signup/signup';
import { authGuard } from './Guard/auth-guard';
import { Home } from './core/features/products/components/home/home';
import { Shop } from './core/features/products/components/shop/shop';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Home
    },
    {
        path: 'shop',
        component: Shop
    },
    {
        path: 'login',
        component: Login
    },
    {
        path: 'signup',
        component: Signup
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
