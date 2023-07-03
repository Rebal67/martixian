import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MysqlErrorCodes } from 'src/database/constraints/errors.constraint';
import { UserAlreadyExistException } from 'src/exceptions/user-already-exist.exception';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    try {
      return await this.usersRepository.save(user);
    } catch (e) {
      if (e?.code === MysqlErrorCodes.UniqueViolation) {
        throw new UserAlreadyExistException();
      }
      throw e;
    }
  }
}
