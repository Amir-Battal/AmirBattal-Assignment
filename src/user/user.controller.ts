import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enum/role.enum';
import { AuthGuard } from '../guards/auth/auth.guard';
import { RolesGuard } from '../guards/roles/roles.guard';
import { Roles } from '../decorator/roles.decorator';


@Roles(Role.Admin, Role.User)
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.userService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get()
  findUserByName(@Param('name') name: string) {
    return this.userService.findUserByName(name);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Post(':id/make-admin')
  makeAdmin(@Param('id') id: string){
    return this.userService.makeAdmin(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
