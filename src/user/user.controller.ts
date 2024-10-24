import { Controller, Get, Body, Patch, Param, Delete, SetMetadata, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from 'src/user/enum/role.enum';
import { Roles } from './decorator/roles.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from './guards/roles/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get()
  findUserByName(@Param('name') name: string) {
    return this.userService.findUserByName(name);
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
