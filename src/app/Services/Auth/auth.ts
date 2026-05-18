import { Injectable } from '@angular/core';
import { User } from '../../../Types/User';
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

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async AddUser(user : User){
      user.password = await this.hashPassword(user.password);

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
    const hashedPassword = await this.hashPassword(password);

    const {data , error} = await this.client.from('Users').select('*')
    .eq('username' , username)
    .eq('password' , hashedPassword).single();

    return data;
  }

}
