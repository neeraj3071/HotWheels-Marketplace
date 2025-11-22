import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/utils/prisma';

const app = createApp();

describe('Listings API', () => {
  let accessToken: string;
  let userId: string;
  let listingId: string;

  const testUser = {
    email: 'listings-test@example.com',
    password: 'password123',
    displayName: 'Listings Test User'
  };

  const testListing = {
    title: 'Vintage Hot Wheels Car',
    description: 'A rare vintage Hot Wheels car from 1968',
    model: 'Custom Camaro',
    year: 1968,
    condition: 'LIKE_NEW',
    rarity: 'RARE',
    priceCents: 5000,
    images: ['https://example.com/image1.jpg']
  };

  beforeAll(async () => {
    // Register and login test user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    accessToken = registerResponse.body.accessToken;
    userId = registerResponse.body.user.id;
  });

  afterAll(async () => {
    // Clean up - delete refresh tokens first to avoid foreign key constraint
    await prisma.refreshToken.deleteMany({ where: { userId } });
    await prisma.listing.deleteMany({ where: { ownerId: userId } });
    await prisma.user.deleteMany({ where: { email: testUser.email } });
  });

  describe('POST /api/listings', () => {
    it('should create a new listing', async () => {
      const response = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testListing)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(testListing.title);
      expect(response.body.priceCents).toBe(testListing.priceCents);
      expect(response.body.ownerId).toBe(userId);

      listingId = response.body.id;
    });

    it('should require authentication', async () => {
      await request(app)
        .post('/api/listings')
        .send(testListing)
        .expect(401);
    });

    it('should validate required fields', async () => {
      await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test',
          // Missing required fields
        })
        .expect(400);
    });

    it('should validate price is positive', async () => {
      await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...testListing,
          priceCents: -100
        })
        .expect(400);
    });
  });

  describe('GET /api/listings', () => {
    it('should get paginated listings', async () => {
      const response = await request(app)
        .get('/api/listings')
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('meta');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.meta).toHaveProperty('total');
      expect(response.body.meta).toHaveProperty('page');
      expect(response.body.meta).toHaveProperty('totalPages');
    });

    it('should filter by condition', async () => {
      const response = await request(app)
        .get('/api/listings')
        .query({ condition: 'LIKE_NEW' })
        .expect(200);

      expect(response.body.data.every((l: any) => l.condition === 'LIKE_NEW')).toBe(true);
    });

    it('should filter by rarity', async () => {
      const response = await request(app)
        .get('/api/listings')
        .query({ rarity: 'RARE' })
        .expect(200);

      expect(response.body.data.every((l: any) => l.rarity === 'RARE')).toBe(true);
    });

    it('should search by title', async () => {
      const response = await request(app)
        .get('/api/listings')
        .query({ search: 'Vintage' })
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should filter by price range', async () => {
      const response = await request(app)
        .get('/api/listings')
        .query({ minPrice: 1000, maxPrice: 10000 })
        .expect(200);

      expect(response.body.data.every((l: any) => 
        l.priceCents >= 1000 && l.priceCents <= 10000
      )).toBe(true);
    });
  });

  describe('GET /api/listings/:id', () => {
    it('should get listing by id', async () => {
      const response = await request(app)
        .get(`/api/listings/${listingId}`)
        .expect(200);

      expect(response.body.id).toBe(listingId);
      expect(response.body.title).toBe(testListing.title);
      expect(response.body).toHaveProperty('owner');
    });

    it('should return 404 for non-existent listing', async () => {
      await request(app)
        .get('/api/listings/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  describe('PATCH /api/listings/:id', () => {
    it('should update own listing', async () => {
      const updatedData = {
        title: 'Updated Vintage Hot Wheels Car',
        priceCents: 6000
      };

      const response = await request(app)
        .patch(`/api/listings/${listingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatedData)
        .expect(200);

      expect(response.body.title).toBe(updatedData.title);
      expect(response.body.priceCents).toBe(updatedData.priceCents);
    });

    it('should not update others listing', async () => {
      // Create another user
      const otherUser = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'other@example.com',
          password: 'password123',
          displayName: 'Other User'
        });

      await request(app)
        .patch(`/api/listings/${listingId}`)
        .set('Authorization', `Bearer ${otherUser.body.accessToken}`)
        .send({ title: 'Hacked' })
        .expect(403);

      // Clean up - delete refresh tokens first
      await prisma.refreshToken.deleteMany({ where: { userId: otherUser.body.user.id } });
      await prisma.user.delete({ where: { id: otherUser.body.user.id } });
    });
  });

  describe('DELETE /api/listings/:id', () => {
    it('should delete own listing', async () => {
      // First create a listing to delete
      const createResponse = await request(app)
        .post('/api/listings')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testListing)
        .expect(201);

      const testListingId = createResponse.body.id;

      await request(app)
        .delete(`/api/listings/${testListingId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);

      // Verify soft deletion - listing still exists but has deletedAt set
      const response = await request(app)
        .get(`/api/listings/${testListingId}`)
        .expect(200);

      expect(response.body.deletedAt).toBeTruthy();
    });
  });
});
