import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  authService = inject(AuthService);

  router = inject(Router);

  @Input() username = "";

  @Input() password = "";

  async Login(){

      console.log("username" + this.username);
      console.log("password" + this.password);

      const ret = await this.authService.CheckUser(this.username , this.password);

      if(ret){
        localStorage.setItem("username" , this.username);
        this.router.navigate(['/home']);
      }
      else{
        console.log("invalid user");
      }
  }


}
