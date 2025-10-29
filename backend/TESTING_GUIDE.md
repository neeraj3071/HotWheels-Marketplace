# Testing the Hot Wheels Marketplace Backend API

## Setup

### 1. Start the Backend Server

First, make sure Docker and Postgres are running, then start the server:

```bash
cd backend
npm run dev
```

The server will start on `http://localhost:4000`

## Testing Methods

You have **4 options** to test all the backend APIs:

---

## Option 1: Import Postman Collection (RECOMMENDED ✅)

### Steps:
1. Open Postman
2. Click **Import** button (top left)
3. Select the file: `Hot_Wheels_Marketplace.postman_collection.json`
4. The collection will load with all endpoints organized in folders
5. **Run the requests in this order:**
   - Health → Health Check
   - Auth → Register (saves token automatically)
   - Auth → Login (saves token automatically)
   - Then test any other endpoints

### Features:
- ✅ Variables automatically saved (tokens, IDs)
- ✅ All 40+ endpoints organized
- ✅ Test scripts included
- ✅ Ready to use immediately

---

## Option 2: Use cURL Commands

### Quick Test Flow:

#### 1. Health Check
```bash
curl http://localhost:4000/health
```

#### 2. Register a User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "username": "johndoe",
    "displayName": "John Doe"
  }'
```

**Save the `accessToken` and `refreshToken` from the response!**

#### 3. Login
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

#### 4. Get Current User (Replace YOUR_ACCESS_TOKEN)
```bash
curl -X GET http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### 5. Create a Listing (Replace YOUR_ACCESS_TOKEN)
```bash
curl -X POST http://localhost:4000/api/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rare Hot Wheels 1969 Camaro",
    "description": "Mint condition, unopened package",
    "price": 49.99,
    "condition": "MINT",
    "rarity": "RARE",
    "year": 2020,
    "series": "Treasure Hunt",
    "carModel": "1969 Camaro",
    "manufacturer": "Mattel",
    "images": ["https://example.com/image1.jpg"]
  }'
```

**Save the listing `id` from the response!**

#### 6. Get All Listings
```bash
curl http://localhost:4000/api/listings
```

#### 7. Search Listings
```bash
curl "http://localhost:4000/api/listings?search=Camaro&condition=MINT&rarity=RARE"
```

### More cURL Commands
See `API_TEST_COMMANDS.md` for complete list of all endpoints with curl commands.

---

## Option 3: Quick Test Script

Run a quick test that verifies basic functionality:

```bash
cd backend
./quick-test.sh
```

This will test:
- Health check
- User registration & login
- Create/get/update listings
- Wishlist operations
- User profile management

---

## Option 4: Comprehensive Test Script (RECOMMENDED FOR FULL TESTING ✅)

Run the comprehensive test script that tests ALL 34 endpoints:

```bash
cd backend
./comprehensive-test.sh
```

This will automatically test:
- ✅ Health endpoint
- ✅ Authentication (register, login, refresh, logout)
- ✅ User profiles (get, update, get by ID)
- ✅ Listings (create, get all, search, get by ID, update, delete)
- ✅ Wishlist (add, get, remove)
- ✅ Collection (add, get, update, remove)
- ✅ Saved filters (create, get, update, delete)
- ✅ Messaging (create thread, get threads, get messages, send message)
- ✅ Admin endpoints (verifies proper authorization)
- ✅ Clean up test data

**Output includes:**
- Pass/Fail status for each test
- Color-coded results (green = pass, red = fail)
- Test summary with total passed/failed
- Detailed error messages if tests fail

---

## All Available Endpoints

### Authentication (4 endpoints)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

### Users (5 endpoints)
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/me/change-password` - Change password
- `GET /api/users/me/listings` - Get user's listings

### Listings (6 endpoints)
- `POST /api/listings` - Create listing
- `GET /api/listings` - Get all listings (with filters)
- `GET /api/listings/:id` - Get listing by ID
- `PATCH /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- Search with query params: `?search=...&condition=...&rarity=...&minPrice=...&maxPrice=...`

### Wishlist (3 endpoints)
- `POST /api/users/me/wishlist/:listingId` - Add to wishlist
- `GET /api/users/me/wishlist` - Get wishlist
- `DELETE /api/users/me/wishlist/:listingId` - Remove from wishlist

### Collection (3 endpoints)
- `POST /api/users/me/collection/:listingId` - Add to collection
- `GET /api/users/me/collection` - Get collection
- `DELETE /api/users/me/collection/:listingId` - Remove from collection

### Saved Filters (3 endpoints)
- `POST /api/users/me/filters` - Create saved filter
- `GET /api/users/me/filters` - Get saved filters
- `DELETE /api/users/me/filters/:id` - Delete saved filter

### Messages (4 endpoints)
- `POST /api/messages/threads` - Create message thread
- `GET /api/messages/threads` - Get all threads
- `GET /api/messages/threads/:id` - Get thread with messages
- `POST /api/messages/threads/:id/messages` - Send message in thread

### Admin (4+ endpoints) - Requires ADMIN role
- `GET /api/admin/users` - Get all users
- `PATCH /api/admin/users/:id` - Update user (change role, ban, etc.)
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/listings` - Get all listings
- `PATCH /api/admin/listings/:id` - Update listing status
- `DELETE /api/admin/listings/:id` - Delete listing
- `GET /api/admin/stats` - Get platform statistics

---

## Testing Tips

1. **Start with Postman** - It's the easiest way with automatic token management
2. **Test in order** - Register → Login → Create data → Test features
3. **Save tokens** - You'll need the `accessToken` for authenticated requests
4. **Check responses** - Each endpoint returns proper JSON with status codes
5. **Database** - Make sure Postgres is running (`docker ps` to check)

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Server Error

## Need Help?

- Check `server.log` if server crashes
- Verify Postgres is running: `docker ps | grep postgres`
- Check server is running: `curl http://localhost:4000/health`
- Review API documentation in `API_TEST_COMMANDS.md`
