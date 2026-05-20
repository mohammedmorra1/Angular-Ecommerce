import { Injectable } from '@angular/core';
import { User } from '../../../Types/User';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import * as cryptoJS from 'crypto-js';

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



  async AddUser(user : User){
      user.password = cryptoJS.SHA256(user.password).toString();


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

    password = cryptoJS.SHA256(password).toString();

    const {data , error} = await this.client.from('Users').select('*')
    .eq('username' , username)
    .eq('password' , password).single();

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

  async UpdatePassword(email : string , newPassword : string){
    newPassword = cryptoJS.SHA256(newPassword).toString();

    await this.client.from('Users').update({password : newPassword}).eq('email' , email).select();
  }

}
