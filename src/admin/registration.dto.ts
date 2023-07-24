import{IsNotEmpty,IsEmail, IsString, IsNumber} from "class-validator";

export class registration_Dto{

	

	@IsNotEmpty({message:"Name should not be empty"})
	@IsString()
	name:string;

    @IsNotEmpty({message:"Password should not be empty"})
	password:string;

	@IsEmail()
	email:string;

	@IsNotEmpty()
	@IsString()
	nid:string;

	@IsNotEmpty()
	@IsString()
	phone:string;

	@IsNotEmpty()
	@IsString()
	address:string;

	@IsNotEmpty()
	@IsString()
	status:string;

	

}