import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Role } from '../enum/role.enum';
import { RolesGuard } from '../guards/roles/roles.guard';
import { AuthGuard } from '../guards/auth/auth.guard';
import { AssignedTaskTo } from './dto/assigned-task-to';
import { Roles } from '../decorator/roles.decorator';


@Roles(Role.Admin, Role.User)
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Post(':id/complete')
  markAsComplete(@Param('id') id: string) {
    return this.taskService.markAsComplete(+id);
  }

  @Post('/assign')
  assignedTask(@Body() assignedTaskTo: AssignedTaskTo) {
    return this.taskService.assignedTask(assignedTaskTo);
  }

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.taskService.findAll(page, limit);
  }

  @Get('/completed')
  findCompletedTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.taskService.findCompletedTasks(page, limit);
  }

  @Get('/pending')
  findPendingTasks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.taskService.findPendingTasks(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}
