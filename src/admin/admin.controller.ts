import{Req,Body,Controller,Get,Post,Param,ParseIntPipe,ValidationPipe,UsePipes,Session,Delete,Put} from "@nestjs/common";
import {registration_Dto} from "src/admin/registration.dto";
import * as session from 'express-session';
import {AdminService} from 'src/admin/admin.service';
import{login_Dto} from 'src/admin/login.dto';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';
import {deleteuser_Dto} from 'src/admin/deleteuser.dto';
import {approve_Dto} from 'src/admin/approve_member.dto';
import { changePassword_Dto } from "./changePassword.dto";

@Controller('admin')
export class AdminController {
	constructor(private adminservice:AdminService){}

  //*********Registration_request***************************** */
	@Post('/registration')
	@UsePipes(new ValidationPipe())
	async registrationuser(@Body() registration_dto:registration_Dto ):Promise<any>{
		
		return	await this.adminservice.registrationuser(registration_dto);
    
	}

  //*********Log_in******************************************** */
  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: login_Dto,@Session() session: Record<string, any>): Promise<any> {
	  
    
    const result = await this.adminservice.login(loginDto);

    if (typeof result === 'string') {
      return result; 
    }

    session.name = result.name;
    session.status = result.status;

    if (result.status === 'admin') {
      return `Log in successfully for Admin: ${result.name}`;
    } else if (result.status === 'seller') {
      return `Log in successfully for Seller: ${result.name}`;
    } else if (result.status === 'customer') {
      return `Log in successfully for Customer: ${result.name}`;
    } else {
      return 'Something Wrong';
    }
  }

  
  //see user profile..............
  @Get('/seeuserprofile')
  async seeuserprofile(@Session() session: Record<string, any>): Promise<any> {
    const nameFromSession = session.name;
    if (!nameFromSession) {
      return 'Log in to see your profile.';
    }else if(session.status==='admin'){
      const userProfile = await this.adminservice.seeuserprofile(nameFromSession);
      return userProfile;
    }else{
      return "Loged as an Admin";
    }
  }

///Approved new member................

@Put('/aproved_new_member/:name')
  @UsePipes(new ValidationPipe())
  async approvedNewMember(@Body() approved_dto: approve_Dto, @Param('name') name: string,@Session() session: Record<string, any>): Promise<string> {
    try {
      const status= session.status;
       if(session.status==='admin'){
        const response = await this.adminservice.approvedNewMember(approved_dto, name);
        return response;
       }else{
        return "You are not an Admin!!";
       }
    } catch (error) {
      return 'Error occurred while updating user.';
    }
  }

  // see customer's list................
  @Post('/customer_list')
  async customerList(@Session() session: Record<string, any>){
    const show ="customer";
    if(session.status==='admin'){
      const response = await this.adminservice.customerList(show);
      return response;
     }else{
      return "You are not an Admin!!";
     }
  }

  // see seller's list................
  @Post('/seller_list')
  async sellerList(@Session() session: Record<string, any>){
    const show ="seller";
    if(session.status==='admin'){
      const response = await this.adminservice.sellerList(show);
      return response;
     }else{
      return "You are not an Admin!!";
     }
  }

  // see customer oderlist.........
  @Get('/show_order_list/:username')
   async orderList(@Param('username') name: string, @Session() session: Record<string, any>): Promise<any> {
    if(session.status=="admin"){
      const user = await this.adminservice.orderList(name);
      return user;
    } else{
      return "You are not an Admin";
    }
     
   }

   // search Product list by seller's name.........
  @Get('/Product_list/:username')
  async productList(@Param('username') name: string, @Session() session: Record<string, any>): Promise<any> {
   if(session.status=="admin"){
     const user = await this.adminservice.productList(name);
     return user;
   } else{
     return "You are not an Admin";
   }
    
  }

  //search user by username.........
  @Get('/showregisterduser/:username')
  async getUsers(@Param('username') name: string, @Session() session: Record<string, any>): Promise<any> {
    if(session.status=="admin"){
      const user = await this.adminservice.getUsers(name);
      session.username=user.name;
      return user;
    }else{
      return "You are no an Admin!";
    }
    
  }

//************************Delete User */
@Delete("/delete")
  @UsePipes(new ValidationPipe())
  async deleteUser(@Body() delete_dto:deleteuser_Dto,@Session() session: Record<string, any> ):Promise<any>{
    if(session.status=="admin"){
      return await this.adminservice.deleteUser(delete_dto);
    }else{
      return "You are not Admin!";
    }

  }

//**********************Delete User************ */

@Put('/update-profile/:name')
  @UsePipes(new ValidationPipe())
  async updateProfile(@Body() updateProfileDto: registration_Dto, @Param('name') name: string,@Session() session: Record<string, any> ): Promise<string> {
    if(session.status=="admin"){
      const response = await this.adminservice.updateProfile(updateProfileDto, name);
      return response;
    } else{
      return "You are not Admin!";
    }
  }

  //**************************Blocked user********** */

@Get('/blocked_user/:username')
  async blockeUser(@Param('username') name: string, @Session() session: Record<string, any>): Promise<any> {
    if(session.status=="admin"){
      const user = await this.adminservice.blockeUser(name);
      return user;
    }else{
      return "You are no an Admin!";
    }
    
  }

  @Post('logout')
  logout(@Req() req: Request & { session: any }) {
  req.session.destroy();
  return 'Logout successful!';
}

// @Put('/Chnage_password')
//   @UsePipes(new ValidationPipe())
//   async changePassword(@Body()changePassword_dto: changePassword_Dto,@Session() session: Record<string, any> ): Promise<string> {
//     if(session.status=="admin"){
//       const response = await this.adminservice.changePassword(changePassword_dto,session.name);
//       return response;
//     } else{
//       return "You are not Admin!";
//     }
//   }

  }


