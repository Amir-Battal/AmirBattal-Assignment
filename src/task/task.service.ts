import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService {

  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const res = await this.taskRepository.save(createTaskDto);
    return res;
  }

  findAll() {
    const tasks = this.taskRepository.find();
    return tasks;
  }

  findOne(id: number) {
    const task = this.taskRepository.findOne({ where: { id }});
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const existingTask = await this.taskRepository.findOneBy({ id: id });
    existingTask.title = updateTaskDto.title;
    existingTask.description = updateTaskDto.description;
    existingTask.status = updateTaskDto.status;
    existingTask.assignedTo = updateTaskDto.assignedTo;
    
    const updatedTask = await this.taskRepository.save(existingTask);
    return existingTask;
  }

  remove(id: number) {
    const deletedTask = this.taskRepository.delete({ id });
    return deletedTask;
  }
}
