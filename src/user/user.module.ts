import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MailgunService } from './mailgun.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  PassportModule.register({ defaultStrategy: 'jwt' }),
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
  controllers: [UserController],
  providers: [UserService, MailgunService, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class UserModule { }
