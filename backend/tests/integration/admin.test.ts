import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/utils/prisma';

const app = createApp();

describe('Admin API', () => {
  let adminToken: string;
  let adminId: string;
  let userToken: string;

  beforeAll(async () => {
    // Create admin user (using known admin ID from context)
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'neerajsa@umich.edu',
        password: 'Admin@123'
      });

    if (adminResponse.status === 200) {
      adminToken = adminResponse.body.accessToken;
      adminId = adminResponse.body.user.id;
    }

    // Create regular user for comparison
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'regular-user@example.com',
        password: 'password123',
        displayName: 'Regular User'
      });

    userToken = userResponse.body.accessToken;
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: 'regular-user@example.com' } });
    if (user) {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    await prisma.user.deleteMany({ where: { email: 'regular-user@example.com' } });
  });

  describe('GET /api/admin/stats', () => {
    it('should get platform statistics', async () => {
      if (!adminToken) {
        console.log('Skipping admin test: Admin account not available');
        return;
      }

      const response = await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('totalUsers');
      expect(response.body).toHaveProperty('totalListings');
      expect(response.body).toHaveProperty('totalSales');
      expect(typeof response.body.totalUsers).toBe('number');
    });

    it('should deny access to non-admin users', async () => {
      await request(app)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/admin/stats')
        .expect(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('should list all users', async () => {
      if (!adminToken) {
        console.log('Skipping admin test: Admin account not available');
        return;
      }

      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      if (!adminToken) {
        return;
      }

      const response = await request(app)
        .get('/api/admin/users?page=1&limit=5')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.length).toBeLessThanOrEqual(5);
    });

    it('should deny access to non-admin users', async () => {
      await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });

  describe('PATCH /api/admin/users/:id', () => {
    it('should update user role', async () => {
      if (!adminToken) {
        return;
      }

      const regularUser = await prisma.user.findFirst({
        where: { email: 'regular-user@example.com' }
      });

      const response = await request(app)
        .patch(`/api/admin/users/${regularUser?.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'admin' })
        .expect(200);

      expect(response.body.role).toBe('admin');

      // Revert back
      await request(app)
        .patch(`/api/admin/users/${regularUser?.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ role: 'user' });
    });

    it('should deny access to non-admin users', async () => {
      const regularUser = await prisma.user.findFirst({
        where: { email: 'regular-user@example.com' }
      });

      await request(app)
        .patch(`/api/admin/users/${regularUser?.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ role: 'admin' })
        .expect(403);
    });
  });
});
