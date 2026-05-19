import { Injectable } from '@angular/core';
import { User } from '../../../Types/User';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public pin = "";

  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async AddUser(user : User){
      user.password = await this.hashPassword(user.password);


      const check = await this.GetUserByEmail(user.email);

      if(check.data != null && check.data.length > 0){
        return 0;
      }

      const ret = await this.client.from('Users').insert({
            id : user.id,
            username: user.username,
            email: user.email,
            password: user.password
      });
      return 1;
  }

  async CheckUser(username : string , password : string){
    const hashedPassword = await this.hashPassword(password);

    const {data , error} = await this.client.from('Users').select('*')
    .eq('username' , username)
    .eq('password' , hashedPassword).single();

    return data;
  }

  async GetUserByEmail(email : string){
      const res = (await this.client.from('Users').select('*').eq('email' , email));

      return res;
  }

  GeneratePin(){
    this.pin = Math.floor(100000 + Math.random() * 900000).toString();
    return this.pin;
  }

  UpdatePassword(email : string , newPassword : string){
    newPassword = cryptoJS.SHA256(newPassword).toString();

    this.client.from('Users').update({password : newPassword}).eq('email' , email);
  }

}
