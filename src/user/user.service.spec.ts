import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enum/role.enum';

const mockUserRepository = () => ({
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    delete: jest.fn(),
});

describe('UserService', () => {
    let service: UserService;
    let userRepository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            UserService,
            { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    describe('create', () => {
        it('should create a user successfully', async () => {
            const createUserDto: CreateUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                role: Role.User
            };

            const user = { id: 1, tasks: [], ...createUserDto };

            jest.spyOn(userRepository, 'save').mockResolvedValue(user);

            const result = await service.create(createUserDto);
            expect(result).toEqual(user);
        });

        it('should throw InternalServerErrorException if save fails', async () => {
            const createUserDto: CreateUserDto = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password',
                role: Role.User
            };

            jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Some error'));

            await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('makeAdmin', () => {
        it('should make a user admin successfully', async () => {
            const userId = 1;
            const user = { 
                id: userId, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(userRepository, 'save').mockResolvedValue({ ...user, role: Role.Admin });

            const result = await service.makeAdmin(userId);
            expect(result.message).toBe("User is now admin");
            expect(user.role).toBe(Role.Admin);
        });

        it('should throw UnauthorizedException if user does not exist', async () => {
            const userId = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.makeAdmin(userId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException if save fails', async () => {
            const userId = 1;
            const user = { 
                id: userId, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Save failed'));

            await expect(service.makeAdmin(userId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findAll', () => {
        it('should fetch all users with pagination successfully', async () => {
            const page = 1;
            const limit = 10;
            const users = [
                { 
                    id: 1, 
                    name: "name",
                    email: "email@example.com",
                    password: "password",
                    role: Role.User,
                    tasks: []
                }
            ];
            const total = users.length;

            jest.spyOn(userRepository, 'findAndCount').mockResolvedValue([users, total]);

            const result = await service.findAll(page, limit);
            expect(result).toEqual({
                data: users,
                total,
                page,
                lastPage: Math.ceil(total / limit),
            });
        });

        it('should handle pagination limit exceeding 100', async () => {
            const page = 1;
            const limit = 150;
            const users = [
                { 
                    id: 1, 
                    name: "name",
                    email: "email@example.com",
                    password: "password",
                    role: Role.User,
                    tasks: []
                }
            ];
            const total = users.length;

            jest.spyOn(userRepository, 'findAndCount').mockResolvedValue([users, total]);

            const result = await service.findAll(page, limit);
            expect(result).toEqual({
                data: users,
                total,
                page,
                lastPage: Math.ceil(total / 100),
            });
        });

        it('should throw InternalServerErrorException if fetching users fails', async () => {
            const page = 1;
            const limit = 10;

            jest.spyOn(userRepository, 'findAndCount').mockRejectedValue(new Error('Fetch failed'));

            await expect(service.findAll(page, limit)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should fetch a user successfully', async () => {
            const userId = 1;
            const user = { 
                id: userId, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

            const result = await service.findOne(userId);
            expect(result).toEqual(user);
        });

        it('should throw InternalServerErrorException if fetching fails', async () => {
            const userId = 1;

            jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Fetch failed'));

            await expect(service.findOne(userId)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findUserByName', () => {
        it('should fetch a user by name successfully', async () => {
            const userName = 'Test User';
            const user = { 
                id: 1, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

            const result = await service.findUserByName(userName);
            expect(result).toEqual(user);
        });

        it('should throw InternalServerErrorException if fetching fails', async () => {
            const userName = 'Test User';

            jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Fetch failed'));

            await expect(service.findUserByName(userName)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findUserByEmail', () => {
        it('should fetch a user by email successfully', async () => {
            const userEmail = 'test@example.com';
            const user = { 
                id: 1, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

            const result = await service.findUserByEmail(userEmail);
            expect(result).toEqual(user);
        });

        it('should throw InternalServerErrorException if fetching fails', async () => {
            const userEmail = 'test@example.com';

            jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error('Fetch failed'));

            await expect(service.findUserByEmail(userEmail)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('update', () => {
        it('should update a user successfully', async () => {
            const userId = 1;
            const updateUserDto: UpdateUserDto = {
                name: 'Updated User',
                email: 'updated@example.com',
                password: 'newpassword',
            };
            const user = { id: userId, role: Role.User, tasks: [], ...updateUserDto };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(userRepository, 'save').mockResolvedValue(user);

            const result = await service.update(userId, updateUserDto);
            expect(result).toEqual(user);
        });

        it('should throw InternalServerErrorException if user not found', async () => {
            const userId = 1;
            const updateUserDto: UpdateUserDto = {
                name: 'Updated User',
                email: 'updated@example.com',
                password: 'newpassword',
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.update(userId, updateUserDto)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException if save fails', async () => {
            const userId = 1;
            const updateUserDto: UpdateUserDto = {
                name: 'Updated User',
                email: 'updated@example.com',
                password: 'newpassword',
            };
            const user = { 
                id: userId, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(userRepository, 'save').mockRejectedValue(new Error('Save failed'));

            await expect(service.update(userId, updateUserDto)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('remove', () => {
        it('should remove a user successfully', async () => {
            const userId = 1;
            const user = { 
                id: userId, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(userRepository, 'delete').mockResolvedValue(undefined);

            const result = await service.remove(userId);
            expect(result).toBe("User Deleted Successfully");
        });

        it('should throw UnauthorizedException if user does not exist', async () => {
            const userId = 1;

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

            await expect(service.remove(userId)).rejects.toThrow(InternalServerErrorException);
        });

        it('should throw InternalServerErrorException if remove fails', async () => {
            const userId = 1;
            const user = { 
                id: userId, 
                name: "name",
                email: "email@example.com",
                password: "password",
                role: Role.User,
                tasks: []
            };

            jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
            jest.spyOn(userRepository, 'delete').mockRejectedValue(new Error('Delete failed'));

            await expect(service.remove(userId)).rejects.toThrow(InternalServerErrorException);
        });
    });
});
