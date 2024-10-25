import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserService } from '../user/user.service';
import { AssignedTaskTo } from './dto/assigned-task-to';
import { Role } from '../enum/role.enum';
import { UpdateTaskDto } from './dto/update-task.dto';

const mockTaskRepository = () => ({
  save: jest.fn(),
  findOne: jest.fn(),
  findAndCount: jest.fn(),
  delete: jest.fn(),
});

const mockUserService = () => ({
  findOne: jest.fn(),
});

describe('TaskService', () => {
  let service: TaskService;
  let taskRepository: Repository<Task>;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: getRepositoryToken(Task), useFactory: mockTaskRepository },
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
    userService = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it('should create a task successfully', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: null,
      };
  
      const task = { id: 1, ...createTaskDto, createdAt: new Date().toString(), updatedAt: new Date().toString() };
  
      jest.spyOn(taskRepository, 'save').mockResolvedValue(task);
  
      const result = await service.create(createTaskDto);
      expect(result.message).toEqual("Task created successfully");
    });
  
    it('should throw InternalServerErrorException if save fails', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: null,
      };
  
      jest.spyOn(taskRepository, 'save').mockRejectedValue(new Error('Some error'));
  
      await expect(service.create(createTaskDto)).rejects.toThrow(InternalServerErrorException);
    });
  });


  describe('markAsComplete', () => {
    it('should mark a task as complete successfully', async () => {
      const taskId = 1;
      const existingTask = { 
        id: taskId, 
        title: 'Test Task', 
        description: 'Test Description', 
        status: 'pending', 
        assignedTo: null,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue({ ...existingTask, status: 'completed' });
  
      const result = await service.markAsComplete(taskId);
      expect(result.message).toBe('Task marked as complete');
      expect(existingTask.status).toBe('completed');
    });
  
    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 1;
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.markAsComplete(taskId)).rejects.toThrow(InternalServerErrorException);
    });
  
    it('should throw InternalServerErrorException if save fails', async () => {
      const taskId = 1;
      const existingTask = { 
        id: taskId, 
        title: 'Test Task', 
        description: 'Test Description', 
        status: 'pending', 
        assignedTo: null,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
      };

      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(taskRepository, 'save').mockRejectedValue(new Error('Save failed'));
  
      await expect(service.markAsComplete(taskId)).rejects.toThrow(InternalServerErrorException);
    });
  });
  

  describe('assignedTask', () => {
  it('should assign a task to a user successfully', async () => {
    const assignedTaskTo: AssignedTaskTo = { taskId: 1, to: 2 };
    const task = { 
      id: 1, 
      title: 'Test Task', 
      description: 'Test Description', 
      status: 'pending', 
      assignedTo: [],
      createdAt: new Date().toString(),
      updatedAt: new Date().toString()
    };

    const user = { 
      id: 2, 
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: Role.User,
      tasks: []
    };

    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
    jest.spyOn(userService, 'findOne').mockResolvedValue(user);
    jest.spyOn(taskRepository, 'save').mockResolvedValue({ ...task, assignedTo: [user] });

    const result = await service.assignedTask(assignedTaskTo);
    expect(result.message).toBe('Task assigned successfully');
    expect(task.assignedTo).toContain(user);
  });

  it('should throw NotFoundException if task does not exist', async () => {
    const assignedTaskTo: AssignedTaskTo = { taskId: 1, to: 2 };

    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);

    await expect(service.assignedTask(assignedTaskTo)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    const assignedTaskTo: AssignedTaskTo = { taskId: 1, to: 2 };
    const task = { 
      id: 1, 
      title: 'Test Task', 
      description: 'Test Description', 
      status: 'pending', 
      assignedTo: [],
      createdAt: new Date().toString(),
      updatedAt: new Date().toString()
    };

    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
    jest.spyOn(userService, 'findOne').mockResolvedValue(null);

    await expect(service.assignedTask(assignedTaskTo)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException if save fails', async () => {
    const assignedTaskTo: AssignedTaskTo = { taskId: 1, to: 2 };
    const task = { 
      id: 1, 
      title: 'Test Task', 
      description: 'Test Description', 
      status: 'pending', 
      assignedTo: [],
      createdAt: new Date().toString(),
      updatedAt: new Date().toString()
    };

    const user = { 
      id: 2, 
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: Role.User,
      tasks: []
    };

    jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
    jest.spyOn(userService, 'findOne').mockResolvedValue(user);
    jest.spyOn(taskRepository, 'save').mockRejectedValue(new Error('Save failed'));

    await expect(service.assignedTask(assignedTaskTo)).rejects.toThrow(InternalServerErrorException);
  });
  });


  describe('findAll', () => {
    it('should fetch all tasks with pagination successfully', async () => {
      const page = 1;
      const limit = 10;
      const tasks = [
        { 
          id: 1, 
          title: 'Test Task', 
          description: 'Test Description', 
          status: 'pending', 
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
        { 
          id: 2, 
          title: 'Test Task', 
          description: 'Test Description', 
          status: 'pending', 
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
      ];
      const total = tasks.length;
  
      jest.spyOn(taskRepository, 'findAndCount').mockResolvedValue([tasks, total]);
  
      const result = await service.findAll(page, limit);
      expect(result).toEqual({
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      });
    });
  
    it('should handle pagination limit exceeding 100', async () => {
      const page = 1;
      const limit = 150;
      const tasks = [
        { 
          id: 1, 
          title: 'Test Task', 
          description: 'Test Description', 
          status: 'pending', 
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
      ];
      const total = tasks.length;
  
      jest.spyOn(taskRepository, 'findAndCount').mockResolvedValue([tasks, total]);
  
      const result = await service.findAll(page, limit);
      expect(result).toEqual({
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / 100), 
      });
    });
  
    it('should throw InternalServerErrorException if fetching tasks fails', async () => {
      const page = 1;
      const limit = 10;
  
      jest.spyOn(taskRepository, 'findAndCount').mockRejectedValue(new Error('Fetch failed'));
  
      await expect(service.findAll(page, limit)).rejects.toThrow(InternalServerErrorException);
    });
  });
  

  describe('findOne', () => {
    it('should fetch a task successfully', async () => {
      const taskId = 1;
      const task = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: [],
        createdAt: new Date().toString(),
        updatedAt: new Date().toString()
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(task);
  
      const result = await service.findOne(taskId);
      await expect(result).toEqual(task);
    });
  
    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 1;
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.findOne(taskId)).rejects.toThrow(InternalServerErrorException);
    });
  
    it('should throw InternalServerErrorException if fetching fails', () => {
      const taskId = 1;
  
      jest.spyOn(taskRepository, 'findOne').mockRejectedValue(new Error('Fetch failed'));
  
      expect(service.findOne(taskId)).rejects.toThrow(InternalServerErrorException);
    });
  });
  

  describe('findCompletedTasks', () => {
    it('should fetch completed tasks successfully', async () => {
      const page = 1;
      const limit = 10;
      const tasks = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
        {
          id: 2,
          title: 'Test Task',
          description: 'Test Description',
          status: 'complete',
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
      ];
      const total = tasks.length;
  
      jest.spyOn(taskRepository, 'findAndCount').mockResolvedValue([tasks, total]);
  
      const result = await service.findCompletedTasks(page, limit);
      expect(result).toEqual({
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      });
    });
  
    it('should throw NotFoundException if no completed tasks are found', async () => {
      const page = 1;
      const limit = 10;
  
      jest.spyOn(taskRepository, 'findAndCount').mockResolvedValue(null);
  
      await expect(service.findCompletedTasks(page, limit)).rejects.toThrow(InternalServerErrorException);
    });
  
    it('should throw InternalServerErrorException if fetching fails', async () => {
      const page = 1;
      const limit = 10;
  
      jest.spyOn(taskRepository, 'findAndCount').mockRejectedValue(new Error('Fetch failed'));
  
      await expect(service.findCompletedTasks(page, limit)).rejects.toThrow(InternalServerErrorException);
    });
  });


  describe('findPendingTasks', () => {
    it('should fetch pending tasks successfully', async () => {
      const page = 1;
      const limit = 10;
      const tasks = [
        {
          id: 1,
          title: 'Test Task',
          description: 'Test Description',
          status: 'pending',
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
        {
          id: 2,
          title: 'Test Task',
          description: 'Test Description',
          status: 'complete',
          assignedTo: [],
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        },
      ];
      const total = tasks.length;
  
      jest.spyOn(taskRepository, 'findAndCount').mockResolvedValue([tasks, total]);
  
      const result = await service.findPendingTasks(page, limit);
      expect(result).toEqual({
        data: tasks,
        total,
        page,
        lastPage: Math.ceil(total / limit),
      });
    });
  
    it('should throw NotFoundException if no pending tasks are found', async () => {
      const page = 1;
      const limit = 10;
  
      jest.spyOn(taskRepository, 'findAndCount').mockResolvedValue(null);
  
      await expect(service.findPendingTasks(page, limit)).rejects.toThrow(InternalServerErrorException);
    });
  
    it('should throw InternalServerErrorException if fetching fails', async () => {
      const page = 1;
      const limit = 10;
  
      jest.spyOn(taskRepository, 'findAndCount').mockRejectedValue(new Error('Fetch failed'));
  
      await expect(service.findPendingTasks(page, limit)).rejects.toThrow(InternalServerErrorException);
    });
  });
  
  
  describe('update', () => {
    it('should update a task successfully', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'pending',
        assignedTo: null,
        updatedAt: new Date().toString(),
      };
  
      const existingTask = {
        id: taskId,
        title: 'Old Task',
        description: 'Old Description',
        status: 'pending',
        assignedTo: [],
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(taskRepository, 'save').mockResolvedValue({ ...existingTask, ...updateTaskDto });
  
      const result = await service.update(taskId, updateTaskDto);
      expect(result.existingTask).toEqual({ ...existingTask, ...updateTaskDto });
      expect(result.message).toBe('Task updated successfully');
    });
  
    it('should throw NotFoundException if task does not exist', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'pending',
        assignedTo: null,
        updatedAt: new Date().toString(),
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.update(taskId, updateTaskDto)).rejects.toThrow(InternalServerErrorException);
    });
  
    it('should throw InternalServerErrorException if saving fails', async () => {
      const taskId = 1;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'pending',
        assignedTo: null,
        updatedAt: new Date().toString(),
      };
  
      const existingTask = {
        id: taskId,
        title: 'Old Task',
        description: 'Old Description',
        status: 'pending',
        assignedTo: [],
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(taskRepository, 'save').mockRejectedValue(new Error('Save failed'));
  
      await expect(service.update(taskId, updateTaskDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
  

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const taskId = 1;
      const existingTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: [],
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(taskRepository, 'delete').mockResolvedValue(undefined);
  
      const result = await service.remove(taskId);
      expect(result).toBe('Task Deleted Successfully');
    });
  
    it('should throw UnauthorizedException if task does not exist', async () => {
      const taskId = 1;
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(null);
  
      await expect(service.remove(taskId)).rejects.toThrow(InternalServerErrorException);
    });
  
    it('should throw InternalServerErrorException if deletion fails', async () => {
      const taskId = 1;
      const existingTask = {
        id: taskId,
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        assignedTo: [],
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
      };
  
      jest.spyOn(taskRepository, 'findOne').mockResolvedValue(existingTask);
      jest.spyOn(taskRepository, 'delete').mockRejectedValue(new Error('Delete failed'));
  
      await expect(service.remove(taskId)).rejects.toThrow(InternalServerErrorException);
    });
  });
});
