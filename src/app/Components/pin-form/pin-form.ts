import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pin-form',
  imports: [FormsModule],
  templateUrl: './pin-form.html',
  styleUrl: './pin-form.css',
})
export class PinForm {

  @Input() pin = "";

  auth = inject(AuthService);

  invalidPin = false;
  
  router = inject(Router);

  ValidatePin(){

      if(this.pin == this.auth.pin){
          localStorage.setItem('pin' , this.pin);
          this.router.navigate(['/resetpassword']);
      }
      else this.invalidPin = false;

  }

}
