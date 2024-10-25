import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

const mockUserService = () => ({
    findAll: jest.fn(),
    findOne: jest.fn(),
    findUserByName: jest.fn(),
    makeAdmin: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
});

const mockJwtService = () => ({
    sign: jest.fn(),
    verify: jest.fn(),
});

describe('UserController', () => {
    let controller: UserController;
    let userService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useFactory: mockUserService },
                { provide: JwtService, useFactory: mockJwtService }
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    describe('findAll', () => {
        it('should return all users with pagination', async () => {
            const users = [{ id: 1, name: 'Test User' }];
            const page = 1;
            const limit = 10;

            jest.spyOn(userService, 'findAll').mockResolvedValue({ data: users, total: 1, page, lastPage: 1 });

            const result = await controller.findAll(page, limit);
            expect(result).toEqual({ data: users, total: 1, page, lastPage: 1 });
            expect(userService.findAll).toHaveBeenCalledWith(page, limit);
        });
    });

    describe('findOne', () => {
        it('should return a user by ID', async () => {
            const userId = '1';
            const user = { id: 1, name: 'Test User' };

            jest.spyOn(userService, 'findOne').mockResolvedValue(user);

            const result = await controller.findOne(userId);
            expect(result).toEqual(user);
            expect(userService.findOne).toHaveBeenCalledWith(+userId);
        });
    });

    describe('findUserByName', () => {
        it('should return a user by name', async () => {
            const userName = 'Test User';
            const user = { id: 1, name: userName };

            jest.spyOn(userService, 'findUserByName').mockResolvedValue(user);

            const result = await controller.findUserByName(userName);
            expect(result).toEqual(user);
            expect(userService.findUserByName).toHaveBeenCalledWith(userName);
        });
    });

    describe('makeAdmin', () => {
        it('should make a user an admin', async () => {
            const userId = '1';
            jest.spyOn(userService, 'makeAdmin').mockResolvedValue('User promoted to admin');

            const result = await controller.makeAdmin(userId);
            expect(result).toBe('User promoted to admin');
            expect(userService.makeAdmin).toHaveBeenCalledWith(+userId);
        });
    });

    describe('update', () => {
        it('should update a user successfully', async () => {
            const userId = '1';
            const updateUserDto: UpdateUserDto = {
                name: 'Updated User',
                email: 'updated@example.com',
                password: 'password'
            };
            const updatedUser = { id: 1, ...updateUserDto };

            jest.spyOn(userService, 'update').mockResolvedValue(updatedUser);

            const result = await controller.update(userId, updateUserDto);
            expect(result).toEqual(updatedUser);
            expect(userService.update).toHaveBeenCalledWith(+userId, updateUserDto);
        });
    });

    describe('remove', () => {
        it('should remove a user successfully', async () => {
            const userId = '1';
            jest.spyOn(userService, 'remove').mockResolvedValue('User deleted successfully');

            const result = await controller.remove(userId);
            expect(result).toBe('User deleted successfully');
            expect(userService.remove).toHaveBeenCalledWith(+userId);
        });
    });
});
