import { ConflictException, Injectable} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailgunService } from './mailgun.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, private readonly mailgunService: MailgunService, private jwtService: JwtService,
  ) { }


  // CREATE USER 
  async createUser(createUserDto: CreateUserDto, hashedPassword: string): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ email: createUserDto.email });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user: User = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.isVerified = false;

    const savedUser = await this.userRepository.save(user);

    setTimeout(async () => {
      const userToDelete = await this.userRepository.findOneById(savedUser.id);
      if (userToDelete && !userToDelete.isVerified) {
        await this.userRepository.remove(userToDelete);
        console.log(`User ${userToDelete.id} deleted due to non-verification.`);
      }
    }, 10 * 60 * 1000);

    return savedUser;
  }

  // SEND VERIFICATION MAIL TO REGISTERED USER 
  async sendVerificationEmail(user: User): Promise<void> {
    const verificationToken = this.jwtService.sign({ userId: user.id });

    const verificationLink = `http://localhost:3000/user/verify/${verificationToken}`;
    console.log(verificationLink)

    const emailSubject = 'Welcome to NEST-API ! Verify Your Email Address';
    const emailBody = `
      Hi ${user.name},

      Thank you for registering on NEST-API! To complete your account setup, please click the following link to verify your email address:
      
     ${verificationLink}
      
      If you didn't sign up for NEST-API, please ignore this email.

      Best regards,
      The NEST API Team
    `;
    await this.mailgunService.sendEmail(user.email, emailSubject, emailBody);
  }


  // TOKEN VERIFICATION 
  async verifyTokenAndGetUserId(token: string): Promise<string> {
    try {
      const decodedToken = this.jwtService.verify(token);

      const { userId } = decodedToken;
      return userId;
    } catch (error) {
      throw new Error('Invalid token.');
    }
  }

  async findUserById(userId: string): Promise<User | undefined> {
    return this.userRepository.findOneById(userId);
  }
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOneBy({ email });
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }



  // NOT CREATED YET 

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
