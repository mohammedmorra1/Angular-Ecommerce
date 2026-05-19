import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Signup } from './Components/signup/signup';
import { authGuard } from './Guard/auth/auth-guard';
import { ForgetPassword } from './Components/forget-password/forget-password';
import { PinForm } from './Components/pin-form/pin-form';
import { ResetPassword } from './Components/reset-password/reset-password';

export const routes: Routes = [

    {
        path:'login',
        component: Login
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
