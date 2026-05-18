import { Injectable } from '@angular/core';
import { User } from '../../../Types/User';
import * as cryptoJS from 'crypto-js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }
  

  async AddUser(user : User){

      user.password = cryptoJS.SHA256(user.password).toString();

      const ret = await this.client.from('Users').insert({
            id : user.id,
            username: user.username,
            email: user.email,
            password: user.password
      });
      console.log(ret);

      return ret;
  }

  async CheckUser(username : string , password : string){

    password = cryptoJS.SHA256(password).toString();

    const {data , error} = await this.client.from('Users').select('*')
    .eq('username' , username)
    .eq('password' , password).single();

    return data;
  }

}

