import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacts } from './entities/contacts.entity';
import { CreateContactsDto } from './dto/create-contacts.dto';
import { UpdateContactsDto } from './dto/update-contacts.dto';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contacts)
    private readonly contactsRepository: Repository<Contacts>,
  ) { }

  // GET ALL CONTACTS
  public async findAllContacts(userId: number, page: number = 1, perPage: number = 10): Promise<Contacts[]> {
    const skip = (page - 1) * perPage;
    return this.contactsRepository.find({
      where: { user: { id: userId } }, // Filter by user ID
      skip,
      take: perPage,
    });
  }


  // SEARCH CONTACT BY NAME OR PHONE
  public async searchContacts(userId: number, nameOrPhone: string): Promise<Contacts[]> {
    const query = this.contactsRepository.createQueryBuilder('contacts');
    query.where('contacts.user.id = :userId AND (LOWER(contacts.name) LIKE :term OR contacts.phone LIKE :term)', {
      userId,
      term: `%${nameOrPhone.toLowerCase()}%`,
    });
  
    const contacts = await query.getMany();
    if (!contacts || contacts.length === 0) {
      throw new NotFoundException('No contacts found for this name or phone number.');
    }
  
    return contacts;
  }

  async findContactsByUserId(userId: number): Promise<Contacts[]> {
    return this.contactsRepository.find({ where: { user: { id: userId } } });
  }

  // CREATE or GENERATE a CONTACT 
  public async createContacts(userId: number, createUserDto: CreateContactsDto): Promise<Contacts> {
    const contacts: Contacts = new Contacts();
    contacts.name = createUserDto.name;
    contacts.email = createUserDto.email;
    contacts.phone = createUserDto.phone;
    contacts.address = createUserDto.address;
    const user = new User();
    user.id = userId;

    contacts.user = user;

    return this.contactsRepository.save(contacts);
  }

  // VIEW ONE CONTACT 
  public async viewContacts(id: number): Promise<Contacts> {
    return this.contactsRepository.findOneBy({ id });
  }


  // UPDATE CONTACT 
  public async updateContacts(id: number, updateContactsDto: UpdateContactsDto): Promise<Contacts> {
    const contacts: Contacts = new Contacts();
    contacts.name = updateContactsDto.name;
    contacts.phone = updateContactsDto.phone;
    contacts.email = updateContactsDto.email;
    contacts.address = updateContactsDto.address;
    contacts.id = id;
    return this.contactsRepository.save(contacts);
  }


  // DELETE CONTACT 
  public async removeContacts(id: number): Promise<void> {
    await this.contactsRepository.delete(id);
  }
}