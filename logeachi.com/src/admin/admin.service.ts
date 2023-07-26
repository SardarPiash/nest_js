import { Injectable ,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './admin.eneity';
import { registration_Dto } from './registration.dto';
import { login_Dto } from './login.dto';
import * as bcrypt from 'bcrypt';
import { deleteuser_Dto } from './deleteuser.dto';
import {approve_Dto} from 'src/admin/approve_member.dto';
import { CustomerEntity } from './customer.entity';
import {SellerEntity} from "src/admin/seller.entity";
//import { MailerService } from '@nestjs-modules/mailer';
import{changePassword_Dto} from "src/admin/changePassword.dto";


@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(UserEntity)
        private userRepo:
        Repository<UserEntity>,
        @InjectRepository(CustomerEntity)
        private customerRepo:
        Repository<CustomerEntity>,
        @InjectRepository(SellerEntity)
        private sellerRepo:
        Repository<SellerEntity>){}
        
        //registration user....
        async registrationuser(registration_dtoo: registration_Dto): Promise<any> {
          const User = await this.userRepo.findOne({ where: { name: registration_dtoo.name } });
      
          if (User) {
            
            return 'User exists!';
          } else {

            const newUser = new UserEntity();
            newUser.name = registration_dtoo.name;
            newUser.password = registration_dtoo.password; 
            newUser.email = registration_dtoo.email;
            newUser.nid = registration_dtoo.nid;
            newUser.phone = registration_dtoo.phone;
            newUser.address = registration_dtoo.address;
            newUser.status = registration_dtoo.status;

            const hashedPassword = await bcrypt.hash(registration_dtoo.password, 10);
            newUser.password = hashedPassword;

           const savedUser = await this.userRepo.save(newUser);

           return "User added Successfull";
          }
        }

      //login.....
      async login(login_dto: login_Dto): Promise<{ name: string; status: string } | string> {
        const user = await this.userRepo.findOne({ where: { name: login_dto.name } });
        let msg;
        if (!user) {
          return 'Login unsuccessful: User not found';
        }
        const passwordMatch = await bcrypt.compare(login_dto.password, user.password);

    if (!passwordMatch) {
      return 'Login unsuccessful: Incorrect password';
    }
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.status=user.status;
        return { name: newUser.name, status: newUser.status };

      }
      ///see profile................
      async seeuserprofile(name: string): Promise<any> {
        const user = await this.userRepo.findOne({ where: { name: name } });
    
        if (user.status==="admin") {
          const User = new UserEntity();
          User.name = user.name;
          User.email = user.email;
          User.nid = user.nid;
          User.phone = user.phone;
          User.address = user.address;
          User.status = user.status;
          return User;
        } else {
          return "User not found";
        }
      }

      ///see unapproved member................
      async getUnapprovedUsers(): Promise<UserEntity[]> {
        const users = await this.userRepo.find({ where: { approval: null } });

        if (users !== null) {
          const customers: UserEntity[] = [];
      
          for (const user of users) {
            if (user.approval === null || user.approval =="Blocked") {
              const customer = new UserEntity();
              customer.name = user.name;
              customer.email = user.email;
              customer.nid = user.nid;
              customer.phone = user.phone;
              customer.address = user.address;
              customer.status = user.status;
              customer.approval=user.approval;
      
              customers.push(customer);
            }
          }
      
          return customers;
        }
      
        return [];
        
        //return unapprovedUsers;
      }
    


      //*************Approved new member************* */
      async approvedNewMember(approved_Dto: approve_Dto, name: string): Promise<string> {
        const regUser = await this.userRepo.findOne({ where: { name } });
    
        if (!regUser) {
          throw new NotFoundException('User not found in the database.');
        }
    
        regUser.approval = approved_Dto.approved;
    
        try {
          await this.userRepo.createQueryBuilder()
            .update(UserEntity)
            .set({ approval: approved_Dto.approved })
            .where('name = :name', { name })
            .execute();
    
          return 'User Approved Successfully!';
        }catch (error) {
          throw new Error('User Not Found.');
        }
      }
    ///******************show customer List************* */
    async customerList(show:string):Promise<any>{
      const users = await this.userRepo.find({ where: { status: show } });
      if (users !== null) {
        const customers: UserEntity[] = [];
    
        for (const user of users) {
          if (user.approval !== null && user.approval !=="Blocked") {
            const customer = new UserEntity();
            customer.name = user.name;
            customer.email = user.email;
            customer.nid = user.nid;
            customer.phone = user.phone;
            customer.address = user.address;
            customer.status = user.status;
    
            customers.push(customer);
          }
        }
    
        return customers;
      }
    
      return [];
    
    }

     ///******************show Seller List************* */
     async sellerList(show:string):Promise<any>{
      const users = await this.userRepo.find({ where: { status: show } });
      if (users !== null) {
        const sellers: UserEntity[] = [];
    
        for (const user of users) {
          if (user.approval !== null && user.approval !=="Blocked") {
            const seller = new UserEntity();
            seller.name = user.name;
            seller.email = user.email;
            seller.nid = user.nid;
            seller.phone = user.phone;
            seller.address = user.address;
            seller.status = user.status;
    
            sellers.push(seller);
          }
        }
    
        return sellers;
      }
    
      return [];
    
    }

//*************see customer order list............*/

async orderList(name: string): Promise<any> {
  const orderList = await this.customerRepo.find({ where: { name: name } });
  const orders: CustomerEntity[] = [];
    
  for (const orderinfo of orderList) {
    
    const order = new CustomerEntity();
    order.name = orderinfo.name;
    order.product_name = orderinfo.product_name;
    order.seller_name = orderinfo.seller_name;

    orders.push(order); 
}
return orders;

}

//*************search customer order list............*/

async productList(name: string): Promise<any> {
  const productList = await this.sellerRepo.find({ where: { name: name } });
  const products: SellerEntity[] = [];
    
  for (const productsinfo of productList) {
    
    const product = new SellerEntity();
    product.product_id=productsinfo.product_id;
    product.name = productsinfo.name;
    product.product_name = productsinfo.product_name;
    product.product_description = productsinfo.product_description;
    product.price = productsinfo.price;

    products.push(product); 
}
return products;

}

///search user by session.....
async getUsers(name: string): Promise<any> {
  const user = await this.userRepo.findOne({ where: { name: name } });

  if (user) {
    if(user.status==="seller" || user.status==="customer"){

    const newUser = new UserEntity();
      newUser.name = user.name;
      newUser.email = user.email;
      newUser.nid = user.nid;
      newUser.phone = user.phone;
      newUser.address = user.address;
      return newUser;
    }else{
      return "User not found!";
    }
  } else {
    return "User not Found";
  }
}

    //delete user............
    async deleteUser(delete_dtoo: deleteuser_Dto): Promise<any> {
      const user = await this.userRepo.findOne({ where: { name: delete_dtoo.name } });
    
      if (!user) {
        return 'User not exists!';
      } else {
        await this.userRepo.delete({ name: delete_dtoo.name });
        return 'User deleted successfully!';
      }
    }

      //update user profile by admin.....
      async updateProfile(updateProfileDto: registration_Dto, name: string): Promise<string> {
        const regUser = await this.userRepo.findOne({ where: { name } });
    
        if (!regUser) {
          throw new NotFoundException('User not found in the database.');
        }
        else if(updateProfileDto.status===regUser.status){
        regUser.name = regUser.name;
        regUser.password = updateProfileDto.password;
        regUser.email = updateProfileDto.email;
        regUser.nid = updateProfileDto.nid;
        regUser.phone = updateProfileDto.phone;
        regUser.address = updateProfileDto.address;
        regUser.status=regUser.status;
    
        try {
          
            const up = await this.userRepo.update({ name }, regUser);
            return "User Update successfully!";
          
          
        } catch (error) {
          throw new Error('User Not Found.');
        }
      }else{
        return "Name & Status Can not be changed!";
      }
    }

    //*********************Blocked User************* */
    async blockeUser(name: string): Promise<any> {
      const user = await this.userRepo.findOne({ where: { name: name } });
    
      if (!user) {
        return 'User not exists!';
      } else if(user.status!=="admin") {
        user.approval = "Blocked";
    
        try {
          await this.userRepo.createQueryBuilder()
            .update(UserEntity)
            .set({ approval: user.approval })
            .where('name = :name', { name })
            .execute();
    
          return 'User Blocked!';
        
      }catch(error){
        return "User Not Blocked!";
      }
    }else{
      return "Admin Blocked is not possible!";
    }
}

// async changePassword(changePassword_Dto: changePassword_Dto, name: string): Promise<string> {
//   const regUser = await this.userRepo.findOne({ where: { name } });

//   if (!regUser) {
//     throw new NotFoundException('User not found in the database.');
//   }
//   else if(changePassword_Dto.oldpassword===changePassword_Dto.oldpassword){
//   regUser.name = regUser.name;
//   regUser.password = updateProfileDto.password;
//   regUser.email = updateProfileDto.email;
//   regUser.nid = updateProfileDto.nid;
//   regUser.phone = updateProfileDto.phone;
//   regUser.address = updateProfileDto.address;
//   regUser.status=regUser.status;

//   try {
    
//       const up = await this.userRepo.update({ name }, regUser);
//       return "User Update successfully!";
    
    
//   } catch (error) {
//     throw new Error('User Not Found.');
//   }
// }else{
//   return "Name & Status Can not be changed!";
// }
//}
}