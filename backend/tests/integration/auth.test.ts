import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/utils/prisma';

const app = createApp();

describe('Auth API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    displayName: 'Test User'
  };

  afterAll(async () => {
    // Clean up test user - delete refresh tokens first
    const user = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (user) {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    await prisma.user.deleteMany({
      where: { email: testUser.email }
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user.displayName).toBe(testUser.displayName);
      expect(response.body.user).not.toHaveProperty('passwordHash');
    });

    it('should not register user with existing email', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          displayName: 'Test'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should require minimum password length', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: '12345',
          displayName: 'Test'
        })
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should not login with invalid email', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);
    });

    it('should not login with invalid password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      refreshToken = response.body.refreshToken;
    });

    it('should logout successfully', async () => {
      await request(app)
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(200);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        });
      
      refreshToken = response.body.refreshToken;
    });

    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should reject invalid refresh token', async () => {
      await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);
    });
  });
});
