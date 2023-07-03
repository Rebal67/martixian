import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/abstract.entity';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  firstName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  lastName: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;
}
