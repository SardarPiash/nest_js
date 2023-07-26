import{IsNotEmpty,IsString} from "class-validator";

export class deleteuser_Dto{
    @IsNotEmpty()
    @IsString()
	name:string;


}