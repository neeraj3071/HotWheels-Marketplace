#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:4000"
PASS_COUNT=0
FAIL_COUNT=0

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "   ${GREEN}✅ PASS${NC}: $2"
        ((PASS_COUNT++))
    else
        echo -e "   ${RED}❌ FAIL${NC}: $2"
        ((FAIL_COUNT++))
        if [ -n "$3" ]; then
            echo -e "   ${YELLOW}Response: $3${NC}"
        fi
    fi
}

echo -e "${BLUE}🧪 Comprehensive Hot Wheels Marketplace Backend API Testing${NC}"
echo "=============================================================="
echo ""

# ==============================================
# 1. HEALTH CHECK
# ==============================================
echo -e "${BLUE}📡 Test 1: Health Check${NC}"
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "ok"; then
    print_result 0 "Health endpoint"
else
    print_result 1 "Health endpoint" "$HEALTH"
    exit 1
fi

# ==============================================
# 2. AUTHENTICATION
# ==============================================
echo -e "\n${BLUE}🔐 Test 2: Authentication Endpoints${NC}"
EMAIL="test$(date +%s)@example.com"
EMAIL2="test2$(date +%s)@example.com"
PASSWORD="SecurePass123!"

# 2.1 Register User 1
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"displayName\": \"Test User\"
  }")

if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
    print_result 0 "Register user"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
else
    print_result 1 "Register user" "$REGISTER_RESPONSE"
    exit 1
fi

# 2.2 Register User 2 (for messaging tests)
REGISTER_RESPONSE2=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL2\",
    \"password\": \"$PASSWORD\",
    \"displayName\": \"Test User 2\"
  }")

if echo "$REGISTER_RESPONSE2" | grep -q "accessToken"; then
    print_result 0 "Register second user"
    TOKEN2=$(echo "$REGISTER_RESPONSE2" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    USER_ID2=$(echo "$REGISTER_RESPONSE2" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
else
    print_result 1 "Register second user" "$REGISTER_RESPONSE2"
fi

# 2.3 Login
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    print_result 0 "Login user"
else
    print_result 1 "Login user" "$LOGIN_RESPONSE"
fi

# 2.4 Refresh Token
REFRESH_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }")

if echo "$REFRESH_RESPONSE" | grep -q "accessToken"; then
    print_result 0 "Refresh token"
    TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$REFRESH_RESPONSE" | grep -o '"refreshToken":"[^"]*' | cut -d'"' -f4)
else
    print_result 1 "Refresh token" "$REFRESH_RESPONSE"
fi

# ==============================================
# 3. USER PROFILE
# ==============================================
echo -e "\n${BLUE}👤 Test 3: User Profile Endpoints${NC}"

# 3.1 Get Current User
USER_RESPONSE=$(curl -s "$BASE_URL/api/users/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$USER_RESPONSE" | grep -q "$EMAIL"; then
    print_result 0 "Get current user profile"
else
    print_result 1 "Get current user profile" "$USER_RESPONSE"
fi

# 3.2 Update Profile
UPDATE_RESPONSE=$(curl -s -X PATCH "$BASE_URL/api/users/me" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "displayName": "Updated Test User",
    "bio": "Hot Wheels enthusiast"
  }')

if echo "$UPDATE_RESPONSE" | grep -q "Updated"; then
    print_result 0 "Update user profile"
else
    print_result 1 "Update user profile" "$UPDATE_RESPONSE"
fi

# 3.3 Get User By ID
USER_BY_ID=$(curl -s "$BASE_URL/api/users/$USER_ID")

if echo "$USER_BY_ID" | grep -q "$USER_ID"; then
    print_result 0 "Get user by ID"
else
    print_result 1 "Get user by ID" "$USER_BY_ID"
fi

# ==============================================
# 4. LISTINGS
# ==============================================
echo -e "\n${BLUE}📦 Test 4: Listings Endpoints${NC}"

# 4.1 Create Listing
CREATE_LISTING=$(curl -s -X POST "$BASE_URL/api/listings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Hot Wheels 1969 Camaro",
    "description": "A test listing for comprehensive API testing",
    "priceCents": 2999,
    "condition": "NEW",
    "rarity": "RARE",
    "year": 2020,
    "model": "1969 Camaro Z28",
    "images": ["https://example.com/image1.jpg"]
  }')

if echo "$CREATE_LISTING" | grep -q '"id"'; then
    print_result 0 "Create listing"
    LISTING_ID=$(echo "$CREATE_LISTING" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
else
    print_result 1 "Create listing" "$CREATE_LISTING"
fi

# 4.2 Get All Listings
ALL_LISTINGS=$(curl -s "$BASE_URL/api/listings?page=1&pageSize=10")

if echo "$ALL_LISTINGS" | grep -q '"data"'; then
    print_result 0 "Get all listings"
else
    print_result 1 "Get all listings" "$ALL_LISTINGS"
fi

# 4.3 Search Listings
SEARCH_LISTINGS=$(curl -s "$BASE_URL/api/listings?search=Camaro&condition=NEW")

if echo "$SEARCH_LISTINGS" | grep -q '"data"'; then
    print_result 0 "Search listings"
else
    print_result 1 "Search listings" "$SEARCH_LISTINGS"
fi

# 4.4 Get Listing By ID
if [ -n "$LISTING_ID" ]; then
    LISTING_DETAIL=$(curl -s "$BASE_URL/api/listings/$LISTING_ID")
    
    if echo "$LISTING_DETAIL" | grep -q "$LISTING_ID"; then
        print_result 0 "Get listing by ID"
    else
        print_result 1 "Get listing by ID" "$LISTING_DETAIL"
    fi
fi

# 4.5 Update Listing
if [ -n "$LISTING_ID" ]; then
    UPDATE_LISTING=$(curl -s -X PATCH "$BASE_URL/api/listings/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "priceCents": 3499,
        "description": "Updated description"
      }')
    
    if echo "$UPDATE_LISTING" | grep -q "3499"; then
        print_result 0 "Update listing"
    else
        print_result 1 "Update listing" "$UPDATE_LISTING"
    fi
fi

# ==============================================
# 5. WISHLIST
# ==============================================
echo -e "\n${BLUE}💝 Test 5: Wishlist Endpoints${NC}"

# 5.1 Add to Wishlist
if [ -n "$LISTING_ID" ]; then
    ADD_WISHLIST=$(curl -s -X POST "$BASE_URL/api/users/me/wishlist" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"listingId\": \"$LISTING_ID\"
      }")
    
    if echo "$ADD_WISHLIST" | grep -q "message"; then
        print_result 0 "Add to wishlist"
    else
        print_result 1 "Add to wishlist" "$ADD_WISHLIST"
    fi
fi

# 5.2 Get Wishlist
GET_WISHLIST=$(curl -s "$BASE_URL/api/users/me/wishlist" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_WISHLIST" | grep -q "wishlist"; then
    print_result 0 "Get wishlist"
else
    print_result 1 "Get wishlist" "$GET_WISHLIST"
fi

# 5.3 Remove from Wishlist
if [ -n "$LISTING_ID" ]; then
    REMOVE_WISHLIST=$(curl -s -X DELETE "$BASE_URL/api/users/me/wishlist/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -w "%{http_code}")
    
    if echo "$REMOVE_WISHLIST" | grep -q "204"; then
        print_result 0 "Remove from wishlist"
    else
        print_result 1 "Remove from wishlist" "$REMOVE_WISHLIST"
    fi
fi

# ==============================================
# 6. COLLECTION
# ==============================================
echo -e "\n${BLUE}🎯 Test 6: Collection Endpoints${NC}"

# 6.1 Add to Collection
if [ -n "$LISTING_ID" ]; then
    ADD_COLLECTION=$(curl -s -X POST "$BASE_URL/api/users/me/collection" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"listingId\": \"$LISTING_ID\",
        \"notes\": \"Test collection item\"
      }")
    
    if echo "$ADD_COLLECTION" | grep -q "message"; then
        print_result 0 "Add to collection"
    else
        print_result 1 "Add to collection" "$ADD_COLLECTION"
    fi
fi

# 6.2 Get Collection
GET_COLLECTION=$(curl -s "$BASE_URL/api/users/me/collection" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_COLLECTION" | grep -q "collection"; then
    print_result 0 "Get collection"
else
    print_result 1 "Get collection" "$GET_COLLECTION"
fi

# 6.3 Update Collection Item
if [ -n "$LISTING_ID" ]; then
    UPDATE_COLLECTION=$(curl -s -X PATCH "$BASE_URL/api/users/me/collection/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "notes": "Updated notes"
      }')
    
    if echo "$UPDATE_COLLECTION" | grep -q "message"; then
        print_result 0 "Update collection item"
    else
        print_result 1 "Update collection item" "$UPDATE_COLLECTION"
    fi
fi

# 6.4 Remove from Collection
if [ -n "$LISTING_ID" ]; then
    REMOVE_COLLECTION=$(curl -s -X DELETE "$BASE_URL/api/users/me/collection/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -w "%{http_code}")
    
    if echo "$REMOVE_COLLECTION" | grep -q "204"; then
        print_result 0 "Remove from collection"
    else
        print_result 1 "Remove from collection" "$REMOVE_COLLECTION"
    fi
fi

# ==============================================
# 7. SAVED FILTERS
# ==============================================
echo -e "\n${BLUE}🔍 Test 7: Saved Filters Endpoints${NC}"

# 7.1 Create Saved Filter
CREATE_FILTER=$(curl -s -X POST "$BASE_URL/api/users/me/filters" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Filter",
    "criteria": {
      "rarity": "RARE",
      "condition": "NEW"
    }
  }')

if echo "$CREATE_FILTER" | grep -q "message"; then
    print_result 0 "Create saved filter"
else
    print_result 1 "Create saved filter" "$CREATE_FILTER"
fi

# 7.2 Get Saved Filters
GET_FILTERS=$(curl -s "$BASE_URL/api/users/me/filters" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_FILTERS" | grep -q "filters"; then
    print_result 0 "Get saved filters"
    FILTER_ID=$(echo "$GET_FILTERS" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
else
    print_result 1 "Get saved filters" "$GET_FILTERS"
fi

# 7.3 Update Saved Filter
if [ -n "$FILTER_ID" ]; then
    UPDATE_FILTER=$(curl -s -X PATCH "$BASE_URL/api/users/me/filters/$FILTER_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Updated Filter Name"
      }')
    
    if echo "$UPDATE_FILTER" | grep -q "Updated"; then
        print_result 0 "Update saved filter"
    else
        print_result 1 "Update saved filter" "$UPDATE_FILTER"
    fi
fi

# 7.4 Delete Saved Filter
if [ -n "$FILTER_ID" ]; then
    DELETE_FILTER=$(curl -s -X DELETE "$BASE_URL/api/users/me/filters/$FILTER_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -w "%{http_code}")
    
    if echo "$DELETE_FILTER" | grep -q "204"; then
        print_result 0 "Delete saved filter"
    else
        print_result 1 "Delete saved filter" "$DELETE_FILTER"
    fi
fi

# ==============================================
# 8. MESSAGING
# ==============================================
echo -e "\n${BLUE}💬 Test 8: Messaging Endpoints${NC}"

# 8.1 Create Message Thread
if [ -n "$USER_ID2" ]; then
    CREATE_THREAD=$(curl -s -X POST "$BASE_URL/api/messages/threads" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"participantId\": \"$USER_ID2\",
        \"listingId\": \"$LISTING_ID\"
      }")
    
    if echo "$CREATE_THREAD" | grep -q '"id"'; then
        print_result 0 "Create message thread"
        THREAD_ID=$(echo "$CREATE_THREAD" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
    else
        print_result 1 "Create message thread" "$CREATE_THREAD"
    fi
fi

# 8.2 Get All Threads
GET_THREADS=$(curl -s "$BASE_URL/api/messages/threads" \
  -H "Authorization: Bearer $TOKEN")

if echo "$GET_THREADS" | grep -q "threads"; then
    print_result 0 "Get message threads"
else
    print_result 1 "Get message threads" "$GET_THREADS"
fi

# 8.3 Get Thread Messages
if [ -n "$THREAD_ID" ]; then
    GET_MESSAGES=$(curl -s "$BASE_URL/api/messages/threads/$THREAD_ID/messages" \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$GET_MESSAGES" | grep -q "messages"; then
        print_result 0 "Get thread messages"
    else
        print_result 1 "Get thread messages" "$GET_MESSAGES"
    fi
fi

# 8.4 Send Message
if [ -n "$THREAD_ID" ]; then
    SEND_MESSAGE=$(curl -s -X POST "$BASE_URL/api/messages/threads/$THREAD_ID/messages" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "body": "Test message content"
      }')
    
    if echo "$SEND_MESSAGE" | grep -q '"id"'; then
        print_result 0 "Send message in thread"
    else
        print_result 1 "Send message in thread" "$SEND_MESSAGE"
    fi
fi

# ==============================================
# 9. ADMIN ENDPOINTS
# ==============================================
echo -e "\n${BLUE}🛡️  Test 9: Admin Endpoints (Expected to fail - no admin role)${NC}"

# 9.1 Get All Users (Admin)
ADMIN_USERS=$(curl -s "$BASE_URL/api/admin/users" \
  -H "Authorization: Bearer $TOKEN" \
  -w "%{http_code}")

if echo "$ADMIN_USERS" | grep -q "403"; then
    print_result 0 "Admin get users (correctly rejected - not admin)"
else
    print_result 1 "Admin get users (should have been rejected)" "$ADMIN_USERS"
fi

# 9.2 Update User Role (Admin)
UPDATE_ROLE=$(curl -s -X PATCH "$BASE_URL/api/admin/users/$USER_ID2/role" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "USER"
  }' \
  -w "%{http_code}")

if echo "$UPDATE_ROLE" | grep -q "403"; then
    print_result 0 "Admin update user role (correctly rejected - not admin)"
else
    print_result 1 "Admin update user role (should have been rejected)" "$UPDATE_ROLE"
fi

# 9.3 Update Listing Status (Admin)
if [ -n "$LISTING_ID" ]; then
    ADMIN_UPDATE_LISTING=$(curl -s -X PATCH "$BASE_URL/api/admin/listings/$LISTING_ID/status" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "status": "ARCHIVED"
      }' \
      -w "%{http_code}")
    
    if echo "$ADMIN_UPDATE_LISTING" | grep -q "403"; then
        print_result 0 "Admin update listing status (correctly rejected - not admin)"
    else
        print_result 1 "Admin update listing status (should have been rejected)" "$ADMIN_UPDATE_LISTING"
    fi
fi

# 9.4 Admin Archive Listing
if [ -n "$LISTING_ID" ]; then
    ADMIN_DELETE=$(curl -s -X DELETE "$BASE_URL/api/admin/listings/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -w "%{http_code}")
    
    if echo "$ADMIN_DELETE" | grep -q "403"; then
        print_result 0 "Admin delete listing (correctly rejected - not admin)"
    else
        print_result 1 "Admin delete listing (should have been rejected)" "$ADMIN_DELETE"
    fi
fi

# ==============================================
# 10. CLEANUP
# ==============================================
echo -e "\n${BLUE}🧹 Test 10: Cleanup${NC}"

# Delete Listing
if [ -n "$LISTING_ID" ]; then
    DELETE_LISTING=$(curl -s -X DELETE "$BASE_URL/api/listings/$LISTING_ID" \
      -H "Authorization: Bearer $TOKEN" \
      -w "%{http_code}")
    
    if echo "$DELETE_LISTING" | grep -q "204"; then
        print_result 0 "Delete listing (cleanup)"
    else
        print_result 1 "Delete listing (cleanup)" "$DELETE_LISTING"
    fi
fi

# Logout User 1
LOGOUT1=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"refreshToken\": \"$REFRESH_TOKEN\"
  }" \
  -w "%{http_code}")

if echo "$LOGOUT1" | grep -q "204"; then
    print_result 0 "Logout user 1"
else
    print_result 1 "Logout user 1" "$LOGOUT1"
fi

# ==============================================
# SUMMARY
# ==============================================
echo ""
echo "=============================================================="
echo -e "${BLUE}📊 Test Summary${NC}"
echo "=============================================================="
echo -e "${GREEN}Passed: $PASS_COUNT${NC}"
echo -e "${RED}Failed: $FAIL_COUNT${NC}"
echo -e "Total: $((PASS_COUNT + FAIL_COUNT))"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed! Backend is working correctly.${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
