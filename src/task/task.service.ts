import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { AssignedTaskTo } from './dto/assigned-task-to';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {

  constructor(
    private userService: UserService,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    try {
      const res = await this.taskRepository.save(createTaskDto);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async markAsComplete(id: number) {
    const existingTask = await this.taskRepository.findOneBy({ id: id });

    if (!existingTask) {
      throw new NotFoundException('Task not found');
    }

    existingTask.status = "completed";
    await this.taskRepository.save(existingTask);
    return "Task Marked as Complete";
  }

async assignedTask(assignedTaskTo: AssignedTaskTo) {
  const task = await this.taskRepository.findOne({
    where: { id: assignedTaskTo.taskId },
    relations: ['assignedTo'],
  });

  const user = await this.userService.findOne(assignedTaskTo.to);

  if (!task) {
    throw new NotFoundException('Task not found');
  }

  if (!user) {
    throw new NotFoundException('User not found');
  }

  task.assignedTo = task.assignedTo || [];

  task.assignedTo.push(user);
  await this.taskRepository.save(task);

  return 'Task Assigned Successfully';
}


  findAll() {
    try {
      const tasks = this.taskRepository.find({ relations: ['assignedTo'] });

      if (!tasks) {
        throw new NotFoundException('No tasks found');
      }

      return tasks;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: number) {
    try {
      const task = this.taskRepository.findOne({ where: { id }});

      if (!task) {
        throw new NotFoundException('Task not found');
      }

      return task;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const existingTask = await this.taskRepository.findOneBy({ id: id });

      if (!existingTask) {
        throw new NotFoundException('Task not found');
      }

      existingTask.title = updateTaskDto.title;
      existingTask.description = updateTaskDto.description;
      existingTask.status = updateTaskDto.status;
      existingTask.assignedTo = updateTaskDto.assignedTo;
      
      await this.taskRepository.save(existingTask);
      return existingTask;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const task = this.taskRepository.findOneBy({ id });

      if(!task) throw new UnauthorizedException("Task doesn't exist");

      await this.taskRepository.delete({ id });

      return "Task Deleted Successfully";
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
