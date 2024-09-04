import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contacts } from 'src/contacts/entities/contacts.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/user/jwt.strategy';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Contacts]), PassportModule.register({ defaultStrategy: 'jwt' }),
  JwtModule.registerAsync({
    useFactory: () => {
      return {
        secret: "SU90TA76RE89RP56OL789A",
        signOptions: {
          expiresIn: "3d",
        },
      };
    },
  }),],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule { }
