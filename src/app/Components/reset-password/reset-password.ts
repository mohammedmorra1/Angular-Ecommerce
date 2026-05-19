import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth';
import { Router } from '@angular/router';


function match(group: AbstractControl): ValidationErrors | null{
  let password = group.get("password")?.value;
  let confirmPassword = group.get("confirmPassword")?.value;

  return password !== confirmPassword ? {match : true}: null ;
}


@Component({
  selector: 'app-reset-password',
  imports: [CommonModule , ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

    form = new FormGroup({
    
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

  auth = inject(AuthService);

  router = inject(Router);

  UpdatePassword(){
      this.auth.UpdatePassword(localStorage.getItem('email')! , this.form.get("email")?.value!);
      this.router.navigate(['/login']);
  }

}
