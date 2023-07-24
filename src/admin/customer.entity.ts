import {Entity,Column,PrimaryGeneratedColumn} from 'typeorm';

@Entity("customer")
	export class CustomerEntity{
        
		@PrimaryGeneratedColumn()
		id:number;

		@Column()
		name:string;

		@Column()
		product_name:string;

		@Column()
		seller_name:string;

	}