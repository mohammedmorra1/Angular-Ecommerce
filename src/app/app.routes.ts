import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Signup } from './Components/signup/signup';
import { authGuard } from './Guard/auth-guard';

export const routes: Routes = [

    {
        path:'login',
        component: Login
    },
    {
        path:'signup',
        component: Signup
    }
];
