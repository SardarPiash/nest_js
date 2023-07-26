import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import{TypeOrmModule} from '@nestjs/typeorm';


@Module({
  imports: [AdminModule,TypeOrmModule.forRoot({
    type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Piash@1234',
      database: 'ecm',
      autoLoadEntities:true,
      synchronize: true,
}),
],
controllers: [],
providers: [],
})
export class AppModule {}
