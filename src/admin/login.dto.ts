import{IsNotEmpty,IsEmail, IsString, IsNumber} from "class-validator";

export class login_Dto{
    @IsNotEmpty()
	//@IsEmail()
	name:string;

    @IsNotEmpty()
	password:string;

}