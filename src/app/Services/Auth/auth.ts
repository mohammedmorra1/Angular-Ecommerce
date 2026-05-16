import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../../../Types/User';
import { baseUrl } from '../../../baseUrl';
import * as cryptoJS from 'crypto-js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { supabaseKey } from '../../../supaBaseKey'
import { SHA256 } from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {


  private client: SupabaseClient;

  constructor() {
    this.client = createClient(
      baseUrl,
      supabaseKey
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


