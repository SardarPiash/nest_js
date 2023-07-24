import{IsNotEmpty,IsEmail, IsString, IsNumber} from "class-validator";

export class changePassword_Dto{
    @IsNotEmpty()
	oldpassword:string;

    @IsNotEmpty()
	newpassword:string;

}