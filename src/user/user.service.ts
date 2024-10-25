import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../enum/role.enum';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UserService.name)

  async create(createUserDto: CreateUserDto) {
    try {
      const res = await this.userRepository.save(createUserDto);

      this.logger.log(`User Created Successfully`);
      return res;
    } catch (error) {
      this.logger.error('Failed to create user', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async makeAdmin(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
  
      if (!user) {
        throw new UnauthorizedException("User doesn't exist");
      }
  
      user.role = Role.Admin;
      await this.userRepository.save(user);
  
      this.logger.log(`User ${user.id} is now admin`);
      return { message: "User is now admin" };
    } catch (error) {
      this.logger.error(`Failed to makeAdmin`, error.stack)
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(page: number = 1, limit: number = 10) {
    try {

      limit = limit > 100 ? 100 : limit;

      const [tasks, total] = await this.userRepository.findAndCount({ 
        skip: (page - 1) * limit,
        take: limit,
        relations: ['tasks'] 
      });

      this.logger.log(`Users Fetched Successfully`);
      return {
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error(`Failed to fetch users`, error.stack);
      throw new InternalServerErrorException(error.message);
    }
  } 

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id }, relations: ['tasks'] });

      this.logger.log(`User Fetched Successfully`);
      return user
    } catch (error) {
      this.logger.error('Failed to fetch user', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserByName(name: string) {
    try {
      const user = await this.userRepository.findOne({ where: { name } });

      this.logger.log(`User Fetched Successfully`);
      return user
    } catch (error) {
      this.logger.error('Failed to fetch user', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findUserByEmail(email: string) {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      this.logger.log(`User Fetched Successfully`);
      return user;
    } catch (error) {
      this.logger.error('Failed to fetch user', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({ where: { id } });
      existingUser.name = updateUserDto.name;
      existingUser.email = updateUserDto.email;

      const hash = await bcrypt.hash(updateUserDto.password, parseInt(process.env.SALT_OR_ROUNDS));
      existingUser.password = hash;

  
      await this.userRepository.save(existingUser);

      this.logger.log(`User ${existingUser.id} Updated Successfully`);
      return existingUser;
    } catch (error) {
      this.logger.error('Failed to update user', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id }, relations: ['tasks'] });      
      
      if (!user) throw new UnauthorizedException("User doesn't exist");

      user.tasks = [];
      await this.userRepository.save(user);

      await this.userRepository.delete({ id });
      
      this.logger.log(`User ${user.id} Deleted Successfully`);
      return "User Deleted Successfully";
    } catch (error) {
      this.logger.error('Failed to delete user', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }
}
