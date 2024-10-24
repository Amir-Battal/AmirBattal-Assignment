import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const res = await this.userRepository.save(createUserDto);
    return res;
  }

  findAll() {
    const tasks = this.userRepository.find({ relations: ['tasks'] });
    return tasks
  } 

  findOne(id: number) {
    const user = this.userRepository.findOne({ where: { id } });
    return user
  }

  findUserByName(name: string) {
    const user = this.userRepository.findOne({ where: { name } });
    return user
  }

  findUserByEmail(email: string) {
    const user = this.userRepository.findOne({ where: { email } });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const existingUser = await this.userRepository.findOneBy({ id: id });
    existingUser.name = updateUserDto.name;
    existingUser.email = updateUserDto.email;
    existingUser.password = updateUserDto.password;
    existingUser.role = updateUserDto.role;

    const updatedUser = await this.userRepository.save(existingUser);
    return existingUser;
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id } });      
      
      if (!user) throw new UnauthorizedException("User doesn't exist");

      await this.userRepository.delete({ id });
      
      return "User Deleted Successfully"
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
