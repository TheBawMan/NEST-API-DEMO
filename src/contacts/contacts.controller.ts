import { Controller, Get, Param, Post, Put, Delete, Body, Query, UseGuards, Patch, NotFoundException, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactsDto } from './dto/create-contacts.dto';
import { UpdateContactsDto } from './dto/update-contacts.dto';
import { AuthGuard } from '@nestjs/passport';
import { Contacts } from './entities/contacts.entity';



@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) { }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  public async findAll(@Req() req): Promise<Contacts[]> {
    const userId = req.user.id;
    return this.contactsService.findContactsByUserId(userId);
  }


  @Get(':term')
  @UseGuards(AuthGuard('jwt'))
  async searchContacts(@Param('term') term: string, @Req() req) {
    const userId = req.user.id;
  
    try {
      const contacts = await this.contactsService.searchContacts(userId, term);
      return contacts;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  

  @Post()
  @UseGuards(AuthGuard())
  public async create(@Req() req, @Body() createContactsDto: CreateContactsDto) {
    const userId = req.user.id;
    return this.contactsService.createContacts(userId, createContactsDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  public async findOne(@Param('id') id: string) {
    return await this.contactsService.viewContacts(+id);
  }
  @Patch(':id')
  @UseGuards(AuthGuard())
  public async update(@Param('id') id: string, @Body() updateContactsDto: UpdateContactsDto) {
    return this.contactsService.updateContacts(+id, updateContactsDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  public async remove(@Param('id') id: string) {
    return this.contactsService.removeContacts(+id);
  }
}

