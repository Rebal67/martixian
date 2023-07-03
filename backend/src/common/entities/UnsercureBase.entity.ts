import { PrimaryGeneratedColumn } from 'typeorm';
import { AbstractBaseEntity } from './base.entity';

export abstract class UnsecureBaseEntity extends AbstractBaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;
}
