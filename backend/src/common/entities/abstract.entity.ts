import { Exclude } from 'class-transformer';
import { PrimaryGeneratedColumn } from 'typeorm';
import { AbstractBaseEntity } from './base.entity';

export abstract class BaseEntity extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  @Exclude()
  public id: number;
}
