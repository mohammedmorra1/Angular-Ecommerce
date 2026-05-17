import { v4 as uuidv4 } from "uuid";
export class User{


    constructor( username : string , email : string , password : string){
        this.id = uuidv4();
        this.username = username;
        this.email = email;
        this.password = password;
    }

    id : string = "";
    username : string = ""
    email : string = ""
    password : string = ""

}