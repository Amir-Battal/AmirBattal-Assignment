import { Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { AssignedTaskTo } from './dto/assigned-task-to';
import { UserService } from '../user/user.service';

@Injectable()
export class TaskService {
  
  constructor(
    private userService: UserService,
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}
  
  private readonly logger = new Logger(TaskService.name)

  async create(createTaskDto: CreateTaskDto) {
    try {
      const res = await this.taskRepository.save(createTaskDto);

      this.logger.log(`Task Created Successfully`);
      return {
        res,
        message: "Task created successfully"
      };
    } catch (error) {
      this.logger.error('Failed to create task', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async markAsComplete(id: number) {
    try {
      const existingTask = await this.taskRepository.findOne({ where: { id } });
  
      if (!existingTask) {
        throw new NotFoundException('Task not found');
      }
  
      existingTask.status = "completed";
      await this.taskRepository.save(existingTask);

      this.logger.log(`Task ${existingTask.id} Marked as Complete`);
      return {
        message: "Task marked as complete"
      };
    } catch (error) {
      this.logger.error('Failed to mark task as complete', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async assignedTask(assignedTaskTo: AssignedTaskTo) {
    try {
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
    
      this.logger.log(`Task ${task.id} assigned to user ${user.id}`);
      return{
        message: "Task assigned successfully"
      };
    } catch (error) {
      this.logger.error('Failed to assign task', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }


  async findAll(page: number = 1, limit: number = 10) {
    try {
      limit = limit > 100 ? 100 : limit;

      const [tasks, total] = await this.taskRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        relations: ['assignedTo'],
      });

      this.logger.log(`Tasks Fetched Successfully with pagination`);

      return {
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to fetch tasks with pagination', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const task = await this.taskRepository.findOne({ where: { id }});

      if (!task) {
        throw new NotFoundException('Task not found');
      }
      this.logger.log(`Task Fetched Successfully`);
      return task;
    } catch (error) {
      this.logger.error('Failed to fetch task', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findCompletedTasks(page: number = 1, limit: number = 10) {
    try {
      limit = limit > 100 ? 100 : limit;

      const [tasks, total] = await this.taskRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: "completed" }, 
        relations: ['assignedTo'] 
      });

      if (!tasks) {
        throw new NotFoundException('No tasks found');
      }
      

      this.logger.log(`Tasks Fetched Successfully`);
      return {
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to fetch tasks', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async findPendingTasks(page: number = 1, limit: number = 10) {
    try {
      limit = limit > 100 ? 100 : limit;

      const [tasks, total] = await this.taskRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { status: "pending" }, 
        relations: ['assignedTo'] 
      });

      if (!tasks) {
        throw new NotFoundException('No tasks found');
      }

      this.logger.log(`Tasks Fetched Successfully`);
      return {
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to fetch tasks', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    try {
      const existingTask = await this.taskRepository.findOne({ where: { id } });

      if (!existingTask) {
        throw new NotFoundException('Task not found');
      }

      existingTask.title = updateTaskDto.title;
      existingTask.description = updateTaskDto.description;
      existingTask.status = updateTaskDto.status;
      existingTask.assignedTo = updateTaskDto.assignedTo;
      
      await this.taskRepository.save(existingTask);
      
      this.logger.log(`Task ${existingTask.id} Updated Successfully`);
      return {
        existingTask,
        message: "Task updated successfully"
      };
    } catch (error) {
      this.logger.error('Failed to update task', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const task = await this.taskRepository.findOne({ where: { id } });

      if(!task) throw new UnauthorizedException("Task doesn't exist");

      await this.taskRepository.delete({ id });

      this.logger.log(`Task ${task.id} Deleted Successfully`);
      return "Task Deleted Successfully";
    } catch (error) {
      this.logger.error('Failed to delete task', error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }
}

