import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import * as bcrypt from 'bcrypt';


describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'amir2@example.com', password: '1234' });

      token = response.body.accessToken;
  });
  
  afterAll(async () => {
    await app.close();
  });


  describe('User Endpoints', () => {
    it('should get all users', async () => {
      const response = await request(app.getHttpServer())
        .get('/user')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
  
      expect(response.body).toBeDefined();
    });

    it('should get user by ID', async () => {
      const userId = 13; 
      const response = await request(app.getHttpServer())
        .get(`/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
  
      expect(response.body).toBeDefined();
    });

    it('should update user', async () => {
      const userId = 13;
      const updateData = { name: 'Amir', email: 'amir@example.com', password: '1234' };
    
      const hash = await bcrypt.hash(updateData.password, parseInt(process.env.SALT_OR_ROUNDS));
      updateData.password = hash;
    
      const response = await request(app.getHttpServer())
        .patch(`/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);
    
      const expectedResponse = {
        name: updateData.name,
        email: updateData.email,
      };
    
      expect(response.body).toMatchObject(expectedResponse);
    });
    
    it('should delete user', async () => {
      const userId = 15; 
  
      await request(app.getHttpServer())
        .delete(`/user/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200); 
    });

    it('should make user an admin', async () => {
      const userId = 16; 
  
      const response = await request(app.getHttpServer())
        .post(`/user/${userId}/make-admin`)
        .set('Authorization', `Bearer ${token}`)
        .expect(201);

      console.log(response.body);
  
      expect(response.body).toHaveProperty('message', 'User is now admin');
    });
  });


  describe('Task Endpoints', () => {
    it('should create a new task', async () => {
        const taskData = {
            title: 'TEST Title',
            description: 'TEST Description',
            status: 'inProgress',
            assignedTo: ''
        };

        const response = await request(app.getHttpServer())
            .post('/task')
            .set('Authorization', `Bearer ${token}`)
            .send(taskData)
            .expect(201);

        expect(response.body).toHaveProperty('message', 'Task created successfully');
    });

    it('should get all tasks', async () => {
        const response = await request(app.getHttpServer())
            .get('/task?page=1&limit=10')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toBeDefined();
    });

    it('should get task by ID', async () => {
        const taskId = 8; 
        const response = await request(app.getHttpServer())
            .get(`/task/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toBeDefined();
    });

    it('should update task', async () => {
        const taskId = 9;
        const updateData = {
            title: 'Updated TEST Title',
            description: 'Updated TEST Description',
            status: 'complete',
            assignedTo: ''
        };

        const response = await request(app.getHttpServer())
            .patch(`/task/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateData)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Task updated successfully');
    });

    it('should delete task', async () => {
        const taskId = 10;

        await request(app.getHttpServer())
            .delete(`/task/${taskId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('should mark task as complete', async () => {
        const taskId = 8;

        const response = await request(app.getHttpServer())
            .post(`/task/${taskId}/complete`)
            .set('Authorization', `Bearer ${token}`)
            .expect(201);

        expect(response.body).toHaveProperty('message', 'Task marked as complete');
    });

    it('should assign a task', async () => {
        const assignData = {
            taskId: '8',
            to: '13'
        };

        const response = await request(app.getHttpServer())
            .post('/task/assign')
            .set('Authorization', `Bearer ${token}`)
            .send(assignData)
            .expect(201);

        expect(response.body).toHaveProperty('message', 'Task assigned successfully');
    });

    it('should find completed tasks', async () => {
        const response = await request(app.getHttpServer())
            .get('/task/completed')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toBeDefined();
    });

    it('should find pending tasks', async () => {
        const response = await request(app.getHttpServer())
            .get('/task/pending')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(response.body).toBeDefined();
    });
  });

  describe('Auth Endpoints', () => {
    it('should sign up a new user', async () => {
      const userData = {
          name: 'Amir4',
          email: 'amir4@example.com',
          password: '1234'
      };

      const response = await request(app.getHttpServer())
          .post('/auth/signup')
          .send(userData)
          .expect(200);

      expect(response.body).toHaveProperty('message', 'User created successfully');
    });

    it('should get user profile', async () => {
      const response = await request(app.getHttpServer())
          .get('/auth/profile')
          .set('Authorization', `Bearer ${token}`)
          .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body).toHaveProperty('email', 'amir2@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const invalidLoginData = {
          email: 'invalid@example.com',
          password: 'wrongpassword'
      };

      const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(invalidLoginData)
          .expect(500);

      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

  })



});
