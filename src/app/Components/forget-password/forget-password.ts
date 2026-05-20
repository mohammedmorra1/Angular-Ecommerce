import { Component, inject, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { AuthService } from '../../Services/Auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  imports: [FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  @Input() email : string = "";

  invalidEmail = signal(false);

  auth = inject(AuthService);

  router = inject(Router);

  async sendResetCode() {


    const check = await this.auth.GetUserByEmail(this.email);


    if(check.data == null || check.data.length == 0){
        this.invalidEmail.set(true);
        return;
    }
    else this.invalidEmail.set(false);
     
    let secureGeneratedCode  = this.auth.GeneratePin();

    localStorage.setItem('email' , this.email);

    const templateParams = {
      email_to: this.email,
      auth_code: secureGeneratedCode
    };

    emailjs.send(
      'service_bmxjq66', 
      'template_mf0cv6s', 
      templateParams, 
      '7HngtewL5phCSc_Lr'
    )
    .then(() => {
      alert('Verification code sent to your email!');
    }, (error) => {
      alert('Error sending email: ' + error.text);
    });

    this.router.navigate(['/pinform']);

  }

}
