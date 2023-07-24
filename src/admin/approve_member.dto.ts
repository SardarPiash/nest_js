import{IsNotEmpty, IsString} from "class-validator";

export class approve_Dto{
    // @IsNotEmpty()
    // @IsString()
	// name:string;
    
    @IsNotEmpty()
    @IsString()
	approved:string;


}