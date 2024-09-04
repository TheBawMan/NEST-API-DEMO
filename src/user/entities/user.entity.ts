import { Contacts } from 'src/contacts/entities/contacts.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '30' })
    name: string;

    @Column({ type: 'varchar', length: '40', })
    email: string;

    @Column({ type: 'varchar', length: '100', default: '' })
    password: string;

    @Column({ type: 'boolean', default: false })
    isVerified: boolean;

    @OneToMany(() => Contacts, (contacts) => contacts.user)
    contacts: Contacts[];

}