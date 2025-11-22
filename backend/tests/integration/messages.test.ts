import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/utils/prisma';

const app = createApp();

describe('Messages API', () => {
  let user1Token: string;
  let user1Id: string;
  let user2Token: string;
  let user2Id: string;
  let threadId: string;

  beforeAll(async () => {
    // Create two test users
    const user1Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user1-msg@example.com',
        password: 'password123',
        displayName: 'User 1'
      });
    
    const user2Response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'user2-msg@example.com',
        password: 'password123',
        displayName: 'User 2'
      });

    user1Token = user1Response.body.accessToken;
    user1Id = user1Response.body.user.id;
    user2Token = user2Response.body.accessToken;
    user2Id = user2Response.body.user.id;
  });

  afterAll(async () => {
    const users = await prisma.user.findMany({
      where: {
        email: { in: ['user1-msg@example.com', 'user2-msg@example.com'] }
      }
    });
    for (const user of users) {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    await prisma.user.deleteMany({
      where: {
        email: { in: ['user1-msg@example.com', 'user2-msg@example.com'] }
      }
    });
  });

  describe('POST /api/messages/threads', () => {
    it('should create a message thread', async () => {
      const response = await request(app)
        .post('/api/messages/threads')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ participantId: user2Id })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.participants).toHaveLength(2);
      
      threadId = response.body.id;
    });

    it('should not create thread with self', async () => {
      await request(app)
        .post('/api/messages/threads')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ participantId: user1Id })
        .expect(400);
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/messages/threads')
        .send({ participantId: user2Id })
        .expect(401);
    });
  });

  describe('GET /api/messages/threads', () => {
    it('should get user threads', async () => {
      const response = await request(app)
        .get('/api/messages/threads')
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/messages/threads/:id/messages', () => {
    it('should send a message', async () => {
      const response = await request(app)
        .post(`/api/messages/threads/${threadId}/messages`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ body: 'Hello from user 1' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.body).toBe('Hello from user 1');
      expect(response.body.senderId).toBe(user1Id);
    });

    it('should validate message length', async () => {
      await request(app)
        .post(`/api/messages/threads/${threadId}/messages`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ body: '' })
        .expect(400);
    });

    it('should reject messages over 2000 characters', async () => {
      await request(app)
        .post(`/api/messages/threads/${threadId}/messages`)
        .set('Authorization', `Bearer ${user1Token}`)
        .send({ body: 'a'.repeat(2001) })
        .expect(400);
    });
  });

  describe('GET /api/messages/threads/:id/messages', () => {
    it('should get thread messages', async () => {
      const response = await request(app)
        .get(`/api/messages/threads/${threadId}/messages`)
        .set('Authorization', `Bearer ${user1Token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should not access other users threads', async () => {
      // Create a third user
      const user3Response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user3-msg@example.com',
          password: 'password123',
          displayName: 'User 3'
        });

      await request(app)
        .get(`/api/messages/threads/${threadId}/messages`)
        .set('Authorization', `Bearer ${user3Response.body.accessToken}`)
        .expect(403);

      // Clean up - delete refresh tokens first
      await prisma.refreshToken.deleteMany({ where: { userId: user3Response.body.user.id } });
      await prisma.user.delete({ where: { id: user3Response.body.user.id } });
    });
  });
});
