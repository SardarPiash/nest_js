import {Entity,Column,PrimaryGeneratedColumn} from 'typeorm';

@Entity("seller")
	export class SellerEntity{
        
		@PrimaryGeneratedColumn()
		id:number;

		@Column()
		name:string;

        @Column()
		product_id:string;

		@Column()
		product_name:string;

		@Column()
		product_description:string;

        @Column()
        price:string;

	}