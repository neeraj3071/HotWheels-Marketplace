import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/utils/prisma';

const app = createApp();

describe('Users API', () => {
  let accessToken: string;
  let userId: string;

  const testUser = {
    email: 'users-test@example.com',
    password: 'password123',
    displayName: 'Users Test'
  };

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    accessToken = response.body.accessToken;
    userId = response.body.user.id;
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: testUser.email } });
    if (user) {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  describe('GET /api/users/me', () => {
    it('should get current user profile', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('profile');
      expect(response.body.profile.id).toBe(userId);
      expect(response.body.profile.email).toBe(testUser.email);
      expect(response.body).toHaveProperty('wishlist');
      expect(response.body).toHaveProperty('collection');
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/users/me')
        .expect(401);
    });
  });

  describe('PATCH /api/users/me', () => {
    it('should update user profile', async () => {
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Hot Wheels collector since 1995'
      };

      const response = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.profile.displayName).toBe(updateData.displayName);
      expect(response.body.profile.bio).toBe(updateData.bio);
    });

    it('should validate bio length', async () => {
      await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          bio: 'a'.repeat(501) // Exceeds 500 character limit
        })
        .expect(400);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get public user profile', async () => {
      const response = await request(app)
        .get(`/api/users/${userId}`)
        .expect(200);

      expect(response.body.id).toBe(userId);
      expect(response.body.displayName).toBeDefined();
      expect(response.body).not.toHaveProperty('email'); // Email should be private
    });

    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });
});
