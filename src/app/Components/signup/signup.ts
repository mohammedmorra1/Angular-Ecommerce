import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth';
import { User } from '../../../Types/User';


function match(group: AbstractControl): ValidationErrors | null{
  let password = group.get("password")?.value;
  let confirmPassword = group.get("confirmPassword")?.value;

  return password !== confirmPassword ? {match : true}: null ;
}

@Component({
  selector: 'app-signup',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  router = inject(Router);

  authService = inject(AuthService);

  form = new FormGroup({
    email : new FormControl('' , [Validators.required , Validators.email]),
    username : new FormControl('' , [Validators.required]),

    password : new FormControl('' , [Validators.required , 
      Validators.minLength(8) , 
      Validators.pattern(new RegExp('[^a-zA-Z0-9]' ) ),
      Validators.pattern(new RegExp('[A-Z]') ),
      Validators.pattern(new RegExp('[a-z]') ),
      Validators.pattern(new RegExp('[0-9]') )] ),

    
    confirmPassword : new FormControl('' , [Validators.required])
  },
  {
    validators : match
  });



  async Signup(){


    await this.authService.
    AddUser(new User(this.form.get("username")?.value! , this.form.get("email")?.value!  , this.form.get("password")?.value! ));
    
    this.router.navigate(['/login']);
  }

  Login(){

    

  }

}
