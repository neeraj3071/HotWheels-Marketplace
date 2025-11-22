import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/utils/prisma';

const app = createApp();

describe('Wishlist API', () => {
  let accessToken: string;
  let userId: string;
  let listingId: string;

  beforeAll(async () => {
    // Register user
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'wishlist-test@example.com',
        password: 'password123',
        displayName: 'Wishlist Tester'
      });

    accessToken = userResponse.body.accessToken;
    userId = userResponse.body.user.id;

    // Create a listing to add to wishlist
    const listingResponse = await request(app)
      .post('/api/listings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Bone Shaker',
        description: 'Classic Hot Wheels',
        price: 5.99,
        condition: 'new',
        rarity: 'common',
        category: 'muscle'
      });

    listingId = listingResponse.body.id;
  });

  afterAll(async () => {
    const user = await prisma.user.findUnique({ where: { email: 'wishlist-test@example.com' } });
    if (user) {
      await prisma.refreshToken.deleteMany({ where: { userId: user.id } });
    }
    await prisma.user.deleteMany({ where: { email: 'wishlist-test@example.com' } });
  });

  describe('POST /api/wishlist/:listingId', () => {
    it('should add listing to wishlist', async () => {
      const response = await request(app)
        .post(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(userId);
      expect(response.body.listingId).toBe(listingId);
    });

    it('should not add duplicate to wishlist', async () => {
      await request(app)
        .post(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(409); // Conflict
    });

    it('should require authentication', async () => {
      await request(app)
        .post(`/api/wishlist/${listingId}`)
        .expect(401);
    });

    it('should return 404 for non-existent listing', async () => {
      await request(app)
        .post('/api/wishlist/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('GET /api/wishlist', () => {
    it('should get user wishlist', async () => {
      const response = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('listing');
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/wishlist')
        .expect(401);
    });
  });

  describe('DELETE /api/wishlist/:listingId', () => {
    it('should remove listing from wishlist', async () => {
      await request(app)
        .delete(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      // Verify it's removed
      const wishlistResponse = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(wishlistResponse.body.length).toBe(0);
    });

    it('should return 404 if not in wishlist', async () => {
      await request(app)
        .delete(`/api/wishlist/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
