#!/bin/bash

echo "🧪 Testing Hot Wheels Marketplace Backend APIs"
echo "=============================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Endpoint..."
HEALTH=$(curl -s http://localhost:4000/health)
if echo "$HEALTH" | grep -q "ok"; then
    echo "   ✅ Health check passed"
else
    echo "   ❌ Health check failed"
    exit 1
fi

# Test 2: Register User
echo ""
echo "2️⃣ Testing User Registration..."
EMAIL="test$(date +%s)@example.com"
USERNAME="test$(date +%s)"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"SecurePass123!\",
    \"username\": \"$USERNAME\",
    \"displayName\": \"Test User\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
    echo "   ✅ Registration successful"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
else
    echo "   ❌ Registration failed"
    echo "   Response: $REGISTER_RESPONSE"
    exit 1
fi

# Test 3: Login
echo ""
echo "3️⃣ Testing User Login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"SecurePass123!\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    echo "   ✅ Login successful"
else
    echo "   ❌ Login failed"
    exit 1
fi

# Test 4: Get Current User
echo ""
echo "4️⃣ Testing Get Current User..."
USER_RESPONSE=$(curl -s http://localhost:4000/api/users/me \
  -H "Authorization: Bearer $TOKEN")

if echo "$USER_RESPONSE" | grep -q "$EMAIL"; then
    echo "   ✅ Get current user successful"
else
    echo "   ❌ Get current user failed"
fi

# Test 5: Create a listing
echo -e "\n${BLUE}Test 5: Create a listing...${NC}"
CREATE_LISTING_RESPONSE=$(curl -s -X POST "$BASE_URL/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Hot Wheels Car",
    "description": "A test listing for automation",
    "priceCents": 2999,
    "condition": "NEW",
    "rarity": "COMMON",
    "year": 2024,
    "model": "Test Model"
  }')

if echo "$LISTING_RESPONSE" | grep -q '"id"'; then
    echo "   ✅ Create listing successful"
    LISTING_ID=$(echo "$LISTING_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
else
    echo "   ❌ Create listing failed"
    echo "   Response: $LISTING_RESPONSE"
fi

# Test 6: Get All Listings
echo ""
echo "6️⃣ Testing Get All Listings..."
LISTINGS_RESPONSE=$(curl -s "http://localhost:4000/api/listings?page=1&limit=10")

if echo "$LISTINGS_RESPONSE" | grep -q '"data"'; then
    echo "   ✅ Get all listings successful"
else
    echo "   ❌ Get all listings failed"
fi

# Test 7: Get Listing by ID
if [ -n "$LISTING_ID" ]; then
    echo ""
    echo "7️⃣ Testing Get Listing by ID..."
    LISTING_DETAIL=$(curl -s "http://localhost:4000/api/listings/$LISTING_ID")
    
    if echo "$LISTING_DETAIL" | grep -q "Camaro"; then
        echo "   ✅ Get listing by ID successful"
    else
        echo "   ❌ Get listing by ID failed"
    fi
fi

# Test 8: Add to Wishlist
if [ -n "$LISTING_ID" ]; then
    echo ""
    echo "8️⃣ Testing Add to Wishlist..."
    WISHLIST_ADD=$(curl -s -X POST "http://localhost:4000/api/users/me/wishlist/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$WISHLIST_ADD" | grep -q '"id"'; then
        echo "   ✅ Add to wishlist successful"
    else
        echo "   ⚠️  Add to wishlist response: $(echo $WISHLIST_ADD | head -c 100)"
    fi
fi

# Test 9: Get Wishlist
echo ""
echo "9️⃣ Testing Get Wishlist..."
WISHLIST_GET=$(curl -s http://localhost:4000/api/users/me/wishlist \
  -H "Authorization: Bearer $TOKEN")

if echo "$WISHLIST_GET" | grep -q "wishlist" || echo "$WISHLIST_GET" | grep -q "\[\]"; then
    echo "   ✅ Get wishlist successful"
else
    echo "   ⚠️  Get wishlist needs review"
fi

# Test 10: Update Profile
echo ""
echo "🔟 Testing Update Profile..."
UPDATE_RESPONSE=$(curl -s -X PATCH http://localhost:4000/api/users/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Updated Test User",
    "bio": "Testing profile update"
  }')

if echo "$UPDATE_RESPONSE" | grep -q "Updated"; then
    echo "   ✅ Update profile successful"
else
    echo "   ⚠️  Update profile response: $(echo $UPDATE_RESPONSE | head -c 100)"
fi

# Cleanup
if [ -n "$LISTING_ID" ]; then
    echo ""
    echo "🧹 Cleaning up test data..."
    curl -s -X DELETE "http://localhost:4000/api/listings/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" > /dev/null
    echo "   ✅ Cleanup complete"
fi

echo ""
echo "=============================================="
echo "✅ API Testing Complete!"
echo "=============================================="
