# Hot Wheels Marketplace API - Curl Commands
# Copy and paste these commands to test all backend endpoints
# Make sure the server is running on http://localhost:4000

# ==============================================
# 1. HEALTH CHECK
# ==============================================

curl http://localhost:4000/health

# ==============================================
# 2. AUTHENTICATION ENDPOINTS
# ==============================================

# Register a new user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!",
    "username": "johndoe",
    "displayName": "John Doe"
  }'

# Login (Save the accessToken and refreshToken from response)
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123!"
  }'

# Refresh token (Replace YOUR_REFRESH_TOKEN with actual token)
curl -X POST http://localhost:4000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# Logout (Replace YOUR_ACCESS_TOKEN and YOUR_REFRESH_TOKEN)
curl -X POST http://localhost:4000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'

# ==============================================
# 3. USER PROFILE ENDPOINTS
# ==============================================

# Get current user profile (Replace YOUR_ACCESS_TOKEN)
curl -X GET http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update current user profile
curl -X PATCH http://localhost:4000/api/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "John Updated Doe",
    "bio": "Passionate Hot Wheels collector since 1995",
    "location": "Los Angeles, CA",
    "avatarUrl": "https://example.com/avatar.jpg"
  }'

# Get user by ID (Replace USER_ID)
curl -X GET http://localhost:4000/api/users/USER_ID

# Change password
curl -X POST http://localhost:4000/api/users/me/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecurePass123!",
    "newPassword": "NewSecurePass456!"
  }'

# ==============================================
# 4. LISTINGS ENDPOINTS
# ==============================================

# Create a new listing
curl -X POST http://localhost:4000/api/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rare Hot Wheels 1969 Camaro Z28",
    "description": "Mint condition, unopened package. Part of the 2020 Treasure Hunt series.",
    "priceCents": 4999,
    "condition": "NEW",
    "rarity": "RARE",
    "year": 2020,
    "model": "1969 Camaro Z28",
    "images": [
      "https://example.com/camaro-front.jpg",
      "https://example.com/camaro-side.jpg",
      "https://example.com/camaro-package.jpg"
    ]
  }'

# Get all listings (with pagination)
curl -X GET "http://localhost:4000/api/listings?page=1&limit=10"

# Search listings with filters
curl -X GET "http://localhost:4000/api/listings?search=Camaro&condition=MINT&minPrice=20&maxPrice=100&rarity=RARE"

# Get listing by ID (Replace LISTING_ID)
curl -X GET http://localhost:4000/api/listings/LISTING_ID

# Update listing (Replace LISTING_ID)
curl -X PATCH http://localhost:4000/api/listings/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 59.99,
    "description": "Mint condition, unopened package. Price reduced!",
    "status": "ACTIVE"
  }'

# Delete listing (Replace LISTING_ID)
curl -X DELETE http://localhost:4000/api/listings/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get current user's listings
curl -X GET http://localhost:4000/api/users/me/listings \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ==============================================
# 5. WISHLIST ENDPOINTS
# ==============================================

# Add listing to wishlist (Replace LISTING_ID)
curl -X POST http://localhost:4000/api/users/me/wishlist/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get user's wishlist
curl -X GET http://localhost:4000/api/users/me/wishlist \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Remove from wishlist (Replace LISTING_ID)
curl -X DELETE http://localhost:4000/api/users/me/wishlist/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ==============================================
# 6. COLLECTION ENDPOINTS
# ==============================================

# Add listing to collection (Replace LISTING_ID)
curl -X POST http://localhost:4000/api/users/me/collection/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get user's collection
curl -X GET http://localhost:4000/api/users/me/collection \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Remove from collection (Replace LISTING_ID)
curl -X DELETE http://localhost:4000/api/users/me/collection/LISTING_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ==============================================
# 7. SAVED FILTERS ENDPOINTS
# ==============================================

# Create saved filter
curl -X POST http://localhost:4000/api/users/me/filters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rare Treasure Hunts",
    "filters": {
      "rarity": "RARE",
      "series": "Treasure Hunt",
      "condition": "MINT",
      "minPrice": 30,
      "maxPrice": 100
    }
  }'

# Get all saved filters
curl -X GET http://localhost:4000/api/users/me/filters \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get saved filter by ID (Replace FILTER_ID)
curl -X GET http://localhost:4000/api/users/me/filters/FILTER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Update saved filter (Replace FILTER_ID)
curl -X PATCH http://localhost:4000/api/users/me/filters/FILTER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Filter Name",
    "filters": {
      "rarity": "SUPER_RARE",
      "condition": "MINT"
    }
  }'

# Delete saved filter (Replace FILTER_ID)
curl -X DELETE http://localhost:4000/api/users/me/filters/FILTER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ==============================================
# 8. MESSAGING ENDPOINTS
# ==============================================

# Create message thread (Replace LISTING_ID)
curl -X POST http://localhost:4000/api/messages/threads \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "listingId": "LISTING_ID",
    "message": "Hi! Is this item still available? I am very interested."
  }'

# Get all message threads
curl -X GET http://localhost:4000/api/messages/threads \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get thread by ID with messages (Replace THREAD_ID)
curl -X GET http://localhost:4000/api/messages/threads/THREAD_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Send message in thread (Replace THREAD_ID)
curl -X POST http://localhost:4000/api/messages/threads/THREAD_ID/messages \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Yes, it is still available! Would you like more photos?"
  }'

# Mark thread as read (Replace THREAD_ID)
curl -X PATCH http://localhost:4000/api/messages/threads/THREAD_ID/read \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ==============================================
# 9. ADMIN ENDPOINTS (Requires ADMIN role)
# ==============================================

# Get all users (admin only)
curl -X GET "http://localhost:4000/api/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Get user by ID (admin)
curl -X GET http://localhost:4000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Update user (admin) - can change role, ban user, etc.
curl -X PATCH http://localhost:4000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "MODERATOR",
    "isActive": true
  }'

# Delete user (admin)
curl -X DELETE http://localhost:4000/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Get all listings (admin)
curl -X GET "http://localhost:4000/api/admin/listings?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Get listing by ID (admin)
curl -X GET http://localhost:4000/api/admin/listings/LISTING_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Update listing status (admin) - approve, reject, flag
curl -X PATCH http://localhost:4000/api/admin/listings/LISTING_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "ACTIVE",
    "moderationNotes": "Verified authentic item"
  }'

# Delete listing (admin)
curl -X DELETE http://localhost:4000/api/admin/listings/LISTING_ID \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"

# Get platform statistics (admin)
curl -X GET http://localhost:4000/api/admin/stats \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN"
