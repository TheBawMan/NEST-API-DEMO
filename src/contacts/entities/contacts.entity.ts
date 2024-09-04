import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../../user/entities/user.entity'
@Entity()
export class Contacts {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: '30' })
    name: string;


    @Column({ type: 'varchar', length: '40' })
    email: string;

    @Column({ type: 'varchar', length: '10' })
    phone: string;

    @Column({ type: 'varchar', length: '50' })
    address: string;

    @ManyToOne(() => User, (user) => user.contacts)
    user: User;
}
