import { Module } from '@nestjs/common';
import{TypeOrmModule} from "@nestjs/typeorm";
import{AdminController} from 'src/admin/admin.controller';
import { UserEntity } from './admin.eneity';
import { AdminService } from './admin.service';
import { SellerEntity } from './seller.entity';
import { CustomerEntity } from './customer.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity,SellerEntity,CustomerEntity])],
	controllers:[AdminController],
	providers: [AdminService],
})
export class AdminModule {}
