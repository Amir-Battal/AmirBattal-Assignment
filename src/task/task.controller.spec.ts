import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AssignedTaskTo } from './dto/assigned-task-to';
import { JwtService } from '@nestjs/jwt';

const mockTaskService = () => ({
    create: jest.fn(),
    markAsComplete: jest.fn(),
    assignedTask: jest.fn(),
    findAll: jest.fn(),
    findCompletedTasks: jest.fn(),
    findPendingTasks: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
});

const mockJwtService = () => ({
    sign: jest.fn(),
    verify: jest.fn(),
});

describe('TaskController', () => {
    let controller: TaskController;
    let taskService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [TaskController],
        providers: [
            { provide: TaskService, useFactory: mockTaskService },
            { provide: JwtService, useFactory: mockJwtService }
        ],
        }).compile();

        controller = module.get<TaskController>(TaskController);
        taskService = module.get<TaskService>(TaskService);
    });

    describe('create', () => {
        it('should create a task successfully', async () => {
        const createTaskDto: CreateTaskDto = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending',
            assignedTo: null,
        };

        jest.spyOn(taskService, 'create').mockResolvedValue(createTaskDto);

        const result = await controller.create(createTaskDto);
        expect(result).toEqual(createTaskDto);
        expect(taskService.create).toHaveBeenCalledWith(createTaskDto);
        });
    });

    describe('markAsComplete', () => {
        it('should mark a task as complete', async () => {
        const taskId = '1';
        jest.spyOn(taskService, 'markAsComplete').mockResolvedValue('Task Marked as Complete');

        const result = await controller.markAsComplete(taskId);
        expect(result).toBe('Task Marked as Complete');
        expect(taskService.markAsComplete).toHaveBeenCalledWith(+taskId);
        });
    });

    describe('assignedTask', () => {
        it('should assign a task to a user successfully', async () => {
        const assignedTaskTo: AssignedTaskTo = { taskId: 1, to: 2 };
        jest.spyOn(taskService, 'assignedTask').mockResolvedValue('Task Assigned Successfully');

        const result = await controller.assignedTask(assignedTaskTo);
        expect(result).toBe('Task Assigned Successfully');
        expect(taskService.assignedTask).toHaveBeenCalledWith(assignedTaskTo);
        });
    });

    describe('findAll', () => {
        it('should return all tasks with pagination', async () => {
        const tasks = [{ id: 1, title: 'Test Task' }];
        const page = 1;
        const limit = 10;

        jest.spyOn(taskService, 'findAll').mockResolvedValue({ data: tasks, total: 1, page, lastPage: 1 });

        const result = await controller.findAll(page, limit);
        expect(result).toEqual({ data: tasks, total: 1, page, lastPage: 1 });
        expect(taskService.findAll).toHaveBeenCalledWith(page, limit);
        });
    });

    describe('findCompletedTasks', () => {
        it('should return completed tasks', async () => {
        const tasks = [{ id: 2, title: 'Completed Task' }];
        const page = 1;
        const limit = 10;

        jest.spyOn(taskService, 'findCompletedTasks').mockResolvedValue({ data: tasks, total: 1, page, lastPage: 1 });

        const result = await controller.findCompletedTasks(page, limit);
        expect(result).toEqual({ data: tasks, total: 1, page, lastPage: 1 });
        expect(taskService.findCompletedTasks).toHaveBeenCalledWith(page, limit);
        });
    });

    describe('findPendingTasks', () => {
        it('should return pending tasks', async () => {
        const tasks = [{ id: 3, title: 'Pending Task' }];
        const page = 1;
        const limit = 10;

        jest.spyOn(taskService, 'findPendingTasks').mockResolvedValue({ data: tasks, total: 1, page, lastPage: 1 });

        const result = await controller.findPendingTasks(page, limit);
        expect(result).toEqual({ data: tasks, total: 1, page, lastPage: 1 });
        expect(taskService.findPendingTasks).toHaveBeenCalledWith(page, limit);
        });
    });

    describe('findOne', () => {
        it('should return a task by ID', async () => {
        const taskId = '1';
        const task = { id: 1, title: 'Test Task' };

        jest.spyOn(taskService, 'findOne').mockResolvedValue(task);

        const result = await controller.findOne(taskId);
        expect(result).toEqual(task);
        expect(taskService.findOne).toHaveBeenCalledWith(+taskId);
        });
    });

    describe('update', () => {
        it('should update a task successfully', async () => {
        const taskId = '1';
        const updateTaskDto: UpdateTaskDto = {
            title: 'Updated Task',
            description: 'Updated Description',
            status: 'pending',
            assignedTo: null,
            updatedAt: new Date().toString(),
        };
        const updatedTask = { id: 1, ...updateTaskDto };

        jest.spyOn(taskService, 'update').mockResolvedValue(updatedTask);

        const result = await controller.update(taskId, updateTaskDto);
        expect(result).toEqual(updatedTask);
        expect(taskService.update).toHaveBeenCalledWith(+taskId, updateTaskDto);
        });
    });

    describe('remove', () => {
        it('should remove a task successfully', async () => {
        const taskId = '1';
        jest.spyOn(taskService, 'remove').mockResolvedValue('Task Deleted Successfully');

        const result = await controller.remove(taskId);
        expect(result).toBe('Task Deleted Successfully');
        expect(taskService.remove).toHaveBeenCalledWith(+taskId);
        });
    });
});
