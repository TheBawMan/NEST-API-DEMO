import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from './contacts/contacts.module';
import {Contacts} from './contacts/entities/contacts.entity'
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }) , 
  ConfigModule.forRoot({
  }),TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    password: 'postgres',
    username: 'postgres',
    entities: [Contacts, User],
    database: 'testing',
    synchronize: true,
    logging: true,
  }), ContactsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
